import Database from "better-sqlite3";
import path from "path";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

// Ruta de la base de datos
const dbPath = path.join(process.cwd(), "mentoria.db");
const db = new Database(dbPath);

// Habilitar foreign keys
db.pragma("foreign_keys = ON");

// Crear tablas
db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1
);

CREATE TABLE IF NOT EXISTS user_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    theme_mode TEXT DEFAULT 'light' CHECK(theme_mode IN ('light','dark')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chat_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_name TEXT DEFAULT 'Nueva conversación',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_session_id INTEGER NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(chat_session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
);
`);

// ----------------------------
// FUNCIONES DE USUARIO
// ----------------------------

// Hash de contraseña
export function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
}

// Verificar contraseña
export function verifyPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}

// Registrar nuevo usuario
export function registerUser(username, email, password) {
    const passwordHash = hashPassword(password);
    const stmt = db.prepare(`INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`);
    const info = stmt.run(username, email, passwordHash);

    // Crear configuración por defecto
    const settingsStmt = db.prepare(`INSERT INTO user_settings (user_id) VALUES (?)`);
    settingsStmt.run(info.lastInsertRowid);

    return info.lastInsertRowid;
}

// Buscar usuario por email
export function findUserByEmail(email) {
    const stmt = db.prepare(`SELECT * FROM users WHERE email = ? AND is_active = 1`);
    return stmt.get(email);
}

// Buscar usuario por id
export function findUserById(id) {
    const stmt = db.prepare(`
        SELECT u.id, u.username, u.email, u.created_at, u.updated_at, u.is_active,
               us.theme_mode
        FROM users u
        LEFT JOIN user_settings us ON u.id = us.user_id
        WHERE u.id = ? AND u.is_active = 1
    `);
    return stmt.get(id);
}

// Crear sesión
export function createSession(userId, durationHours = 24) {
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + durationHours * 3600 * 1000).toISOString();
    const stmt = db.prepare(`INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)`);
    stmt.run(userId, token, expiresAt);
    return { token, expiresAt };
}

// Validar sesión
export function validateSession(token) {
    const stmt = db.prepare(`
        SELECT us.session_token, us.expires_at, u.id AS user_id, u.username, u.email
        FROM user_sessions us
        JOIN users u ON us.user_id = u.id
        WHERE us.session_token = ? AND us.expires_at > CURRENT_TIMESTAMP AND u.is_active = 1
    `);
    return stmt.get(token);
}

// Eliminar sesión (logout)
export function deleteSession(token) {
    const stmt = db.prepare(`DELETE FROM user_sessions WHERE session_token = ?`);
    stmt.run(token);
}

// ----------------------------
// FUNCIONES DE ACTUALIZACIÓN DE PERFIL
// ----------------------------

// Actualizar nombre de usuario
export function updateUsername(userId, newUsername) {
    // Verificar que el username no esté en uso
    const checkStmt = db.prepare(`SELECT id FROM users WHERE username = ? AND id != ?`);
    const existing = checkStmt.get(newUsername, userId);
    if (existing) {
        throw new Error('El nombre de usuario ya está en uso');
    }
    
    const stmt = db.prepare(`UPDATE users SET username = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
    const result = stmt.run(newUsername, userId);
    return result.changes > 0;
}

// Actualizar email
export function updateEmail(userId, newEmail) {
    // Verificar que el email no esté en uso
    const checkStmt = db.prepare(`SELECT id FROM users WHERE email = ? AND id != ?`);
    const existing = checkStmt.get(newEmail, userId);
    if (existing) {
        throw new Error('El email ya está en uso');
    }
    
    const stmt = db.prepare(`UPDATE users SET email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
    const result = stmt.run(newEmail, userId);
    return result.changes > 0;
}

// Actualizar contraseña
export function updatePassword(userId, newPassword) {
    const passwordHash = hashPassword(newPassword);
    const stmt = db.prepare(`UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
    const result = stmt.run(passwordHash, userId);
    return result.changes > 0;
}

// Verificar contraseña actual del usuario
export function verifyCurrentPassword(userId, currentPassword) {
    const stmt = db.prepare(`SELECT password_hash FROM users WHERE id = ?`);
    const user = stmt.get(userId);
    if (!user) return false;
    return verifyPassword(currentPassword, user.password_hash);
}

// ----------------------------
// TABLAS PARA QUIZZES Y PROGRESO
// ----------------------------

db.exec(`
CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    topic TEXT NOT NULL,
    difficulty TEXT,
    questions_json TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    answers_json TEXT NOT NULL,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
`);

// ----------------------------
// FUNCIONES PARA QUIZZES
// ----------------------------

export function createQuiz(userId, topic, difficulty, questions) {
    const stmt = db.prepare(`
        INSERT INTO quizzes (user_id, topic, difficulty, questions_json)
        VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(userId, topic, difficulty || null, JSON.stringify(questions));
    return info.lastInsertRowid;
}

export function getRecentQuizzes(userId, limit = 8) {
    const stmt = db.prepare(`
        SELECT id, topic, difficulty, created_at
        FROM quizzes
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ?
    `);
    return stmt.all(userId, limit);
}

export function getQuizById(quizId, userId) {
    const stmt = db.prepare(`
        SELECT id, user_id, topic, difficulty, questions_json, created_at
        FROM quizzes
        WHERE id = ? AND user_id = ?
    `);
    return stmt.get(quizId, userId);
}

export function recordQuizAttempt(quizId, userId, answers, score, total) {
    const stmt = db.prepare(`
        INSERT INTO quiz_attempts (quiz_id, user_id, answers_json, score, total)
        VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(quizId, userId, JSON.stringify(answers), score, total);
    return info.lastInsertRowid;
}

export function getProgressSummary(userId) {
    const totals = db.prepare(`
        SELECT
          (SELECT COUNT(*) FROM quizzes WHERE user_id = ?) AS quizzes_count,
          (SELECT COUNT(*) FROM quiz_attempts WHERE user_id = ?) AS attempts_count,
          (SELECT COALESCE(ROUND(AVG(100.0 * score / total), 2), 0) FROM quiz_attempts WHERE user_id = ?) AS avg_score
    `).get(userId, userId, userId);

    // Obtener todos los intentos recientes (sin límite) con dificultad
    const recentAttempts = db.prepare(`
        SELECT qa.id, qa.quiz_id, q.topic, q.difficulty, qa.score, qa.total, qa.completed_at
        FROM quiz_attempts qa
        JOIN quizzes q ON qa.quiz_id = q.id
        WHERE qa.user_id = ?
        ORDER BY qa.completed_at DESC
    `).all(userId);

    // Obtener distribución de dificultad de todos los quizzes generados
    const difficultyDistribution = db.prepare(`
        SELECT 
          difficulty,
          COUNT(*) as count
        FROM quizzes 
        WHERE user_id = ?
        GROUP BY difficulty
    `).all(userId);

    return { 
        ...totals, 
        recentAttempts,
        difficultyDistribution 
    };
}

// ----------------------------
// FUNCIONES DE CHAT Y CONTEXTO
// ----------------------------

// Crear nueva sesión de chat
export function createChatSession(userId, sessionName = 'Nueva conversación') {
    const stmt = db.prepare(`INSERT INTO chat_sessions (user_id, session_name) VALUES (?, ?)`);
    const info = stmt.run(userId, sessionName);
    return info.lastInsertRowid;
}

// Obtener sesión de chat activa del usuario (la más reciente)
export function getActiveChatSession(userId) {
    const stmt = db.prepare(`
        SELECT id, session_name, created_at, updated_at 
        FROM chat_sessions 
        WHERE user_id = ? 
        ORDER BY updated_at DESC 
        LIMIT 1
    `);
    return stmt.get(userId);
}

// Crear o obtener sesión de chat activa
export function getOrCreateActiveChatSession(userId) {
    let session = getActiveChatSession(userId);
    if (!session) {
        const sessionId = createChatSession(userId);
        session = { id: sessionId, session_name: 'Nueva conversación' };
    }
    return session;
}

// Agregar mensaje a la sesión de chat
export function addChatMessage(chatSessionId, role, content) {
    const stmt = db.prepare(`INSERT INTO chat_messages (chat_session_id, role, content) VALUES (?, ?, ?)`);
    const info = stmt.run(chatSessionId, role, content);
    
    // Actualizar timestamp de la sesión
    const updateStmt = db.prepare(`UPDATE chat_sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
    updateStmt.run(chatSessionId);
    
    return info.lastInsertRowid;
}

// Obtener historial de mensajes de una sesión (últimos N mensajes)
export function getChatHistory(chatSessionId, limit = 20) {
    const stmt = db.prepare(`
        SELECT role, content, created_at 
        FROM chat_messages 
        WHERE chat_session_id = ? 
        ORDER BY created_at DESC 
        LIMIT ?
    `);
    return stmt.all(chatSessionId, limit).reverse(); // Invertir para orden cronológico
}

// Obtener historial de mensajes del usuario activo
export function getUserChatHistory(userId, limit = 20) {
    const session = getActiveChatSession(userId);
    if (!session) return [];
    return getChatHistory(session.id, limit);
}

// Limpiar historial de una sesión
export function clearChatHistory(chatSessionId) {
    const stmt = db.prepare(`DELETE FROM chat_messages WHERE chat_session_id = ?`);
    return stmt.run(chatSessionId);
}

// Obtener todas las sesiones de chat del usuario
export function getUserChatSessions(userId) {
    const stmt = db.prepare(`
        SELECT id, session_name, created_at, updated_at,
               (SELECT COUNT(*) FROM chat_messages WHERE chat_session_id = chat_sessions.id) as message_count
        FROM chat_sessions 
        WHERE user_id = ? 
        ORDER BY updated_at DESC
    `);
    return stmt.all(userId);
}

// Obtener una sesión específica asegurando pertenencia del usuario
export function getChatSessionById(userId, sessionId) {
    const stmt = db.prepare(`
        SELECT id, user_id, session_name, created_at, updated_at
        FROM chat_sessions
        WHERE id = ? AND user_id = ?
    `);
    return stmt.get(sessionId, userId);
}

// Actualizar nombre de una sesión de chat
export function updateChatSessionName(sessionId, newName) {
    const safeName = (newName || '').toString().trim().slice(0, 80);
    const stmt = db.prepare(`UPDATE chat_sessions SET session_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
    const info = stmt.run(safeName.length ? safeName : 'Nueva conversación', sessionId);
    return info.changes > 0;
}

export default db;
