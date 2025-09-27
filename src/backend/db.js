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

export default db;
