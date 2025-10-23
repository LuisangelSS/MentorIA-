import { supabase } from './supabase.js';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

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
export async function registerUser(username, email, password) {
    const passwordHash = hashPassword(password);
    
    const { data, error } = await supabase
        .from('users')
        .insert([
            {
                username,
                email,
                password_hash: passwordHash
            }
        ])
        .select('id')
        .single();

    if (error) throw error;

    // Crear configuración por defecto
    await supabase
        .from('user_settings')
        .insert([{ user_id: data.id }]);

    return data.id;
}

// Buscar usuario por email
export async function findUserByEmail(email) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
}

// Buscar usuario por id
export async function findUserById(id) {
    const { data, error } = await supabase
        .from('users')
        .select(`
            id, username, email, created_at, updated_at, is_active,
            user_settings(theme_mode)
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
}

// Crear sesión
export async function createSession(userId, durationHours = 24) {
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + durationHours * 3600 * 1000).toISOString();
    
    const { error } = await supabase
        .from('user_sessions')
        .insert([{
            user_id: userId,
            session_token: token,
            expires_at: expiresAt
        }]);

    if (error) throw error;
    return { token, expiresAt };
}

// Validar sesión
export async function validateSession(token) {
    const { data, error } = await supabase
        .from('user_sessions')
        .select(`
            session_token, expires_at,
            users!inner(id, username, email)
        `)
        .eq('session_token', token)
        .gt('expires_at', new Date().toISOString())
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    if (data) {
        return {
            session_token: data.session_token,
            expires_at: data.expires_at,
            user_id: data.users.id,
            username: data.users.username,
            email: data.users.email
        };
    }
    return null;
}

// Eliminar sesión (logout)
export async function deleteSession(token) {
    const { error } = await supabase
        .from('user_sessions')
        .delete()
        .eq('session_token', token);

    if (error) throw error;
}

// ----------------------------
// FUNCIONES DE ACTUALIZACIÓN DE PERFIL
// ----------------------------

// Actualizar nombre de usuario
export async function updateUsername(userId, newUsername) {
    // Verificar que el username no esté en uso
    const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('username', newUsername)
        .neq('id', userId)
        .single();

    if (existing) {
        throw new Error('El nombre de usuario ya está en uso');
    }
    
    const { error } = await supabase
        .from('users')
        .update({ username: newUsername })
        .eq('id', userId);

    if (error) throw error;
    return true;
}

// Actualizar email
export async function updateEmail(userId, newEmail) {
    // Verificar que el email no esté en uso
    const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', newEmail)
        .neq('id', userId)
        .single();

    if (existing) {
        throw new Error('El email ya está en uso');
    }
    
    const { error } = await supabase
        .from('users')
        .update({ email: newEmail })
        .eq('id', userId);

    if (error) throw error;
    return true;
}

// Actualizar contraseña
export async function updatePassword(userId, newPassword) {
    const passwordHash = hashPassword(newPassword);
    
    const { error } = await supabase
        .from('users')
        .update({ password_hash: passwordHash })
        .eq('id', userId);

    if (error) throw error;
    return true;
}

// Verificar contraseña actual del usuario
export async function verifyCurrentPassword(userId, currentPassword) {
    const { data, error } = await supabase
        .from('users')
        .select('password_hash')
        .eq('id', userId)
        .single();

    if (error) throw error;
    if (!data) return false;
    
    return verifyPassword(currentPassword, data.password_hash);
}

// ----------------------------
// FUNCIONES PARA QUIZZES
// ----------------------------

export async function createQuiz(userId, topic, difficulty, questions) {
    const { data, error } = await supabase
        .from('quizzes')
        .insert([{
            user_id: userId,
            topic,
            difficulty,
            questions_json: JSON.stringify(questions)
        }])
        .select('id')
        .single();

    if (error) throw error;
    return data.id;
}

export async function getRecentQuizzes(userId, limit = 8) {
    const { data, error } = await supabase
        .from('quizzes')
        .select('id, topic, difficulty, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data || [];
}

export async function getQuizById(quizId, userId) {
    const { data, error } = await supabase
        .from('quizzes')
        .select('id, user_id, topic, difficulty, questions_json, created_at')
        .eq('id', quizId)
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
}

export async function recordQuizAttempt(quizId, userId, answers, score, total) {
    const { data, error } = await supabase
        .from('quiz_attempts')
        .insert([{
            quiz_id: quizId,
            user_id: userId,
            answers_json: answers,
            score,
            total
        }])
        .select('id')
        .single();

    if (error) throw error;
    return data.id;
}

export async function getProgressSummary(userId) {
    // Obtener conteos
    const { data: quizzes } = await supabase
        .from('quizzes')
        .select('id', { count: 'exact' })
        .eq('user_id', userId);

    const { data: attempts } = await supabase
        .from('quiz_attempts')
        .select('id', { count: 'exact' })
        .eq('user_id', userId);

    // Obtener puntaje promedio
    const { data: avgScore } = await supabase
        .from('quiz_attempts')
        .select('score, total')
        .eq('user_id', userId);

    const avg = avgScore && avgScore.length > 0 
        ? avgScore.reduce((sum, attempt) => sum + (attempt.score / attempt.total), 0) / avgScore.length * 100
        : 0;

    // Obtener intentos recientes
    const { data: recentAttempts } = await supabase
        .from('quiz_attempts')
        .select(`
            id, quiz_id, score, total, completed_at,
            quizzes!inner(topic, difficulty)
        `)
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

    // Obtener distribución de dificultad
    const { data: difficultyDistribution } = await supabase
        .from('quizzes')
        .select('difficulty')
        .eq('user_id', userId);

    const distribution = {};
    difficultyDistribution?.forEach(quiz => {
        distribution[quiz.difficulty] = (distribution[quiz.difficulty] || 0) + 1;
    });

    // Generar títulos descriptivos para los intentos recientes
    const recentAttemptsWithTitles = (recentAttempts || []).map(attempt => {
        const quiz = attempt.quizzes;
        const title = generateQuizTitle(quiz.topic, quiz.difficulty);
        return {
            ...attempt,
            title: title
        };
    });

    return {
        quizzes_count: quizzes?.length || 0,
        attempts_count: attempts?.length || 0,
        avg_score: Math.round(avg * 100) / 100,
        recentAttempts: recentAttemptsWithTitles,
        difficultyDistribution: Object.entries(distribution).map(([difficulty, count]) => ({ difficulty, count }))
    };
}

// ----------------------------
// FUNCIONES AUXILIARES
// ----------------------------

// Generar título descriptivo para un quiz
function generateQuizTitle(topic, difficulty) {
    const difficultyMap = {
        'basico': 'Básico',
        'básico': 'Básico', 
        'intermedio': 'Intermedio',
        'avanzado': 'Avanzado',
        'basic': 'Básico',
        'intermediate': 'Intermedio',
        'advanced': 'Avanzado'
    };
    
    const normalizedDifficulty = difficultyMap[difficulty?.toLowerCase()] || 'Intermedio';
    
    // Crear título descriptivo basado en tema y dificultad
    return `Quiz de ${topic} - ${normalizedDifficulty}`;
}

// ----------------------------
// FUNCIONES DE CHAT Y CONTEXTO
// ----------------------------

// Crear nueva sesión de chat
export async function createChatSession(userId, sessionName = 'Nueva conversación') {
    const { data, error } = await supabase
        .from('chat_sessions')
        .insert([{
            user_id: userId,
            session_name: sessionName
        }])
        .select('id')
        .single();

    if (error) throw error;
    return data.id;
}

// Obtener sesión de chat activa del usuario (la más reciente)
export async function getActiveChatSession(userId) {
    const { data, error } = await supabase
        .from('chat_sessions')
        .select('id, session_name, created_at, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
}

// Crear o obtener sesión de chat activa
export async function getOrCreateActiveChatSession(userId) {
    let session = await getActiveChatSession(userId);
    if (!session) {
        const sessionId = await createChatSession(userId);
        session = { id: sessionId, session_name: 'Nueva conversación' };
    }
    return session;
}

// Agregar mensaje a la sesión de chat
export async function addChatMessage(chatSessionId, role, content) {
    const { error } = await supabase
        .from('chat_messages')
        .insert([{
            chat_session_id: chatSessionId,
            role,
            content
        }]);

    if (error) throw error;

    // Actualizar timestamp de la sesión
    await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chatSessionId);

    return true;
}

// Obtener historial de mensajes de una sesión (últimos N mensajes)
export async function getChatHistory(chatSessionId, limit = 20) {
    const { data, error } = await supabase
        .from('chat_messages')
        .select('role, content, created_at')
        .eq('chat_session_id', chatSessionId)
        .order('created_at', { ascending: true })
        .limit(limit);

    if (error) throw error;
    return data || [];
}

// Obtener historial de mensajes del usuario activo
export async function getUserChatHistory(userId, limit = 20) {
    const session = await getActiveChatSession(userId);
    if (!session) return [];
    return await getChatHistory(session.id, limit);
}

// Limpiar historial de una sesión
export async function clearChatHistory(chatSessionId) {
    const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('chat_session_id', chatSessionId);

    if (error) throw error;
    return true;
}

// Obtener todas las sesiones de chat del usuario
export async function getUserChatSessions(userId) {
    const { data, error } = await supabase
        .from('chat_sessions')
        .select(`
            id, session_name, created_at, updated_at,
            chat_messages(count)
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

    if (error) throw error;
    
    return data?.map(session => ({
        ...session,
        message_count: session.chat_messages?.[0]?.count || 0
    })) || [];
}

// Obtener una sesión específica asegurando pertenencia del usuario
export async function getChatSessionById(userId, sessionId) {
    const { data, error } = await supabase
        .from('chat_sessions')
        .select('id, user_id, session_name, created_at, updated_at')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
}

// Actualizar nombre de una sesión de chat
export async function updateChatSessionName(sessionId, newName) {
    const safeName = (newName || '').toString().trim().slice(0, 80);
    
    const { error } = await supabase
        .from('chat_sessions')
        .update({ 
            session_name: safeName.length ? safeName : 'Nueva conversación'
        })
        .eq('id', sessionId);

    if (error) throw error;
    return true;
}

// Eliminar una sesión de chat específica (incluye todos sus mensajes por CASCADE)
export async function deleteChatSession(userId, sessionId) {
    const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', userId);

    if (error) throw error;
    return true;
}

// Eliminar todas las sesiones de chat de un usuario
export async function deleteAllUserChatSessions(userId) {
    const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('user_id', userId);

    if (error) throw error;
    return true;
}

// Eliminar todos los datos del usuario (chats, quizzes, intentos, etc.)
export async function deleteAllUserData(userId) {
    const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

    if (error) throw error;
    return true;
}