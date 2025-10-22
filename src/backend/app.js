import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { marked } from "marked";
import { fileURLToPath } from "url";

// Importar funciones de la base de datos
import {
  registerUser,
  findUserByEmail,
  verifyPassword,
  createSession,
  validateSession,
  deleteSession,
  updateUsername,
  updateEmail,
  updatePassword,
  verifyCurrentPassword,
  createQuiz,
  getRecentQuizzes,
  getQuizById,
  recordQuizAttempt,
  getProgressSummary,
  getOrCreateActiveChatSession,
  addChatMessage,
  getUserChatHistory,
  getUserChatSessions,
  getChatHistory,
  createChatSession,
  getChatSessionById,
  updateChatSessionName,
  deleteChatSession,
  deleteAllUserChatSessions,
  deleteAllUserData
} from "./db.js";

// Inicializar app
const app = express();

// Rutas absolutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FRONTEND_DIR = path.join(__dirname, "../frontend");

// Inicializar GoogleGenAI con variable de entorno
const ai = new GoogleGenAI({ 
  apiKey: process.env.GOOGLE_API_KEY || "" 
});

if (!process.env.GOOGLE_API_KEY) {
  console.warn("⚠️  No se encontró GOOGLE_API_KEY");
}

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta frontend
app.use(express.static(FRONTEND_DIR, {
  maxAge: '1d',
  etag: true
}));

// Rutas HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'template', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'template', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'template', 'registro.html'));
});

app.get('/app', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'template', 'app.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'template', 'profile.html'));
});

app.get('/quizzes', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'template', 'quizzes.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'template', 'dashboard.html'));
});

// Endpoints de usuario / sesión
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const userId = await registerUser(username, email, password);
    res.json({ message: "Usuario registrado correctamente", userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar usuario. Quizá el email o username ya existe." });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Faltan campos obligatorios" });

  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ error: "Usuario no encontrado" });

  if (!verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ error: "Contraseña incorrecta" });
  }

  const session = await createSession(user.id, 24);
  res.json({ token: session.token, expiresAt: session.expiresAt });
});

app.post("/logout", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Falta token de sesión" });

  await deleteSession(token);
  res.json({ message: "Logout exitoso" });
});

app.get("/user-info", async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: "Token de autorización requerido" });
  }

  const session = await validateSession(token);
  if (!session) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }

  res.json({
    id: session.user_id,
    username: session.username,
    email: session.email
  });
});

// Middleware para validar token
async function validateToken(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: "Token de autorización requerido" });
  }

  const session = await validateSession(token);
  if (!session) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }

  req.user = session;
  next();
}

// Endpoints de perfil
app.put("/profile/username", validateToken, async (req, res) => {
  const { newUsername } = req.body;
  if (!newUsername || newUsername.trim().length < 3) {
    return res.status(400).json({ error: "El nombre de usuario debe tener al menos 3 caracteres" });
  }
  try {
    const success = await updateUsername(req.user.user_id, newUsername.trim());
    if (success) {
      res.json({ message: "Nombre de usuario actualizado correctamente" });
    } else {
      res.status(500).json({ error: "Error al actualizar el nombre de usuario" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/profile/email", validateToken, async (req, res) => {
  const { newEmail } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!newEmail || !emailRegex.test(newEmail)) {
    return res.status(400).json({ error: "Email inválido" });
  }
  try {
    const success = await updateEmail(req.user.user_id, newEmail.toLowerCase().trim());
    if (success) {
      res.json({ message: "Email actualizado correctamente" });
    } else {
      res.status(500).json({ error: "Error al actualizar el email" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/profile/password", validateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Se requiere la contraseña actual y la nueva" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: "La nueva contraseña debe tener al menos 6 caracteres" });
  }
  try {
    const isCurrentPasswordValid = await verifyCurrentPassword(req.user.user_id, currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ error: "Contraseña actual incorrecta" });
    }
    const success = await updatePassword(req.user.user_id, newPassword);
    if (success) {
      res.json({ message: "Contraseña actualizada correctamente" });
    } else {
      res.status(500).json({ error: "Error al actualizar la contraseña" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/profile/update-all", validateToken, async (req, res) => {
  const { newUsername, newEmail, currentPassword, newPassword } = req.body;
  const userId = req.user.user_id;
  const errors = [];
  const updates = [];
  
  try {
    if (newUsername && newUsername.trim().length > 0) {
      if (newUsername.trim().length < 3) {
        errors.push("El nombre de usuario debe tener al menos 3 caracteres");
      } else {
        try {
          const success = await updateUsername(userId, newUsername.trim());
          if (success) {
            updates.push("nombre de usuario");
          }
        } catch (error) {
          errors.push(error.message);
        }
      }
    }
    
    if (newEmail && newEmail.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newEmail)) {
        errors.push("Email inválido");
      } else {
        try {
          const success = await updateEmail(userId, newEmail.toLowerCase().trim());
          if (success) {
            updates.push("email");
          }
        } catch (error) {
          errors.push(error.message);
        }
      }
    }
    
    if (newPassword && newPassword.length > 0) {
      if (!currentPassword) {
        errors.push("Se requiere la contraseña actual para cambiarla");
      } else if (newPassword.length < 6) {
        errors.push("La nueva contraseña debe tener al menos 6 caracteres");
      } else {
        const isCurrentPasswordValid = await verifyCurrentPassword(userId, currentPassword);
        if (!isCurrentPasswordValid) {
          errors.push("Contraseña actual incorrecta");
        } else {
          const success = await updatePassword(userId, newPassword);
          if (success) {
            updates.push("contraseña");
          }
        }
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(", ") });
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: "No hay cambios para actualizar" });
    }
    
    res.json({
      message: `Perfil actualizado correctamente. Campos actualizados: ${updates.join(", ")}`,
      updatedFields: updates,
      requiresRelogin: updates.includes("contraseña")
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Chat endpoint
app.post("/chat", validateToken, async (req, res) => {
  const { prompt, chatSessionId, stream = false } = req.body;
  const userId = req.user.user_id;
  
  if (!prompt) {
    return res.status(400).json({ error: "Prompt requerido" });
  }
  
  try {
    let chatSession = null;
    if (chatSessionId) {
      const owned = await getChatSessionById(userId, chatSessionId);
      if (!owned) return res.status(404).json({ error: "Sesión de chat no encontrada" });
      chatSession = owned;
    } else {
      chatSession = await getOrCreateActiveChatSession(userId);
    }
    
    let chatHistory = [];
    if (chatSession) {
      chatHistory = await getChatHistory(chatSession.id, 10);
    }
    
    const contents = [
      {
        role: "model",
        parts: [{
          text: `Eres MentorIA, un asistente de estudio inteligente y adaptable...`
        }]
      }
    ];
    
    chatHistory.forEach(msg => {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    });
    
    contents.push({ role: "user", parts: [{ text: prompt }] });
    
    if (stream) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      let fullResponse = '';
      let isFirstChunk = true;
      
      try {
        const stream = await ai.models.generateContentStream({ 
          model: "gemini-2.5-flash", 
          contents: contents 
        });
        
        for await (const chunk of stream) {
          const chunkText = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
          if (chunkText) {
            fullResponse += chunkText;
            if (isFirstChunk) {
              res.write(`data: ${JSON.stringify({ 
                type: 'start', 
                chatSessionId: chatSession?.id, 
                sessionName: chatSession?.session_name 
              })}\n\n`);
              isFirstChunk = false;
            }
            res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunkText })}\n\n`);
          }
        }
        
        res.write(`data: ${JSON.stringify({ type: 'end', fullText: fullResponse })}\n\n`);
        
        if (chatSession) {
          await addChatMessage(chatSession.id, 'user', prompt);
          await addChatMessage(chatSession.id, 'assistant', fullResponse);
        }
        
        try {
          if (chatSession && (!chatSession.session_name || /^Nueva convers/i.test(chatSession.session_name))) {
            const title = await generateChatTitle(prompt, fullResponse);
            if (title) {
              await updateChatSessionName(chatSession.id, title);
              chatSession.session_name = title;
            }
          }
        } catch (e) {
          console.error("Error generando título:", e);
        }
        
        res.end();
      } catch (streamError) {
        console.error("Error en streaming:", streamError);
        res.write(`data: ${JSON.stringify({ type: 'error', error: 'Error en el streaming' })}\n\n`);
        res.end();
      }
    } else {
      const response = await ai.models.generateContent({ 
        model: "gemini-2.5-flash", 
        contents: contents 
      });
      
      const rawReply = response?.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo generar respuesta";
      const reply = marked.parse(rawReply);
      
      if (chatSession) {
        await addChatMessage(chatSession.id, 'user', prompt);
        await addChatMessage(chatSession.id, 'assistant', rawReply);
      }
      
      try {
        if (chatSession && (!chatSession.session_name || /^Nueva convers/i.test(chatSession.session_name))) {
          const title = await generateChatTitle(prompt, rawReply);
          if (title) {
            await updateChatSessionName(chatSession.id, title);
            chatSession.session_name = title;
          }
        }
      } catch (e) {
        console.error("Error generando título:", e);
      }
      
      res.json({ reply, chatSessionId: chatSession?.id, sessionName: chatSession?.session_name });
    }
  } catch (error) {
    console.error("Error al comunicarse con Gemini:", error);
    if (stream) {
      res.write(`data: ${JSON.stringify({ type: 'error', error: 'Error al comunicarse con Gemini' })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: "Error al comunicarse con Gemini" });
    }
  }
});

// Utilidades
function extractJson(text) {
  if (!text || typeof text !== 'string') return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  let candidate = fenced ? fenced[1] : text;
  const first = candidate.indexOf('{');
  const last = candidate.lastIndexOf('}');
  if (first !== -1 && last !== -1 && last > first) {
    candidate = candidate.slice(first, last + 1);
  }
  return candidate.trim();
}

function tryParseQuiz(text) {
  try { 
    const parsed = JSON.parse(text); 
    if (typeof parsed === 'string') return JSON.parse(parsed); 
    return parsed; 
  } catch {
    const extracted = extractJson(text); 
    if (!extracted) return null; 
    try { 
      const parsed2 = JSON.parse(extracted); 
      if (typeof parsed2 === 'string') return JSON.parse(parsed2); 
      return parsed2; 
    } catch { 
      return null; 
    }
  }
}

function normalizeQuizSchema(quiz, { topic, difficulty }) {
  const out = { 
    topic: quiz?.topic || topic, 
    difficulty: (quiz?.difficulty || difficulty || '').toString(), 
    questions: [] 
  };
  const qs = Array.isArray(quiz?.questions) ? quiz.questions : [];
  
  function makePlaceholder(idx) { 
    const n = idx + 1; 
    return { 
      id: `q${n}`, 
      question: `Pregunta ${n} sobre ${topic}`, 
      options: ["Opción A", "Opción B", "Opción C", "Opción D"], 
      correctIndex: 0, 
      explanation: "" 
    }; 
  }
  
  for (let i = 0; i < qs.length && out.questions.length < 10; i++) {
    const q = qs[i] || {};
    let options = Array.isArray(q.options) ? q.options.slice(0, 4) : [];
    while (options.length < 4) options.push(`Opción ${String.fromCharCode(65 + options.length)}`);
    let ci = q.correctIndex;
    if (typeof ci === 'string') ci = parseInt(ci, 10);
    if (Number.isNaN(ci) || ci < 0 || ci > 3) ci = 0;
    out.questions.push({ 
      id: q.id || `q${out.questions.length + 1}`, 
      question: (q.question || `Pregunta ${out.questions.length + 1} sobre ${topic}`).toString(), 
      options: options.map(o => o.toString()), 
      correctIndex: ci, 
      explanation: (q.explanation || '').toString() 
    });
  }
  
  while (out.questions.length < 10) out.questions.push(makePlaceholder(out.questions.length));
  if (out.questions.length > 10) out.questions = out.questions.slice(0, 10);
  out.questions = out.questions.map((q, idx) => ({ ...q, id: `q${idx + 1}` }));
  
  return out;
}

async function generateChatTitle(userPrompt, rawAssistantReply) {
  const instruction = `Crea un título muy breve (máximo 6 palabras) en español que resuma el tema de esta conversación de estudio. Devuelve solo el título, sin comillas ni puntuación extra.`;
  const contextText = `Usuario: ${userPrompt}\nAsistente: ${rawAssistantReply}`.slice(0, 1000);
  try {
    const r = await ai.models.generateContent({ 
      model: "gemini-2.5-flash", 
      contents: [{ role: 'user', parts: [{ text: `${instruction}\n\n${contextText}` }] }], 
      generationConfig: { temperature: 0.2 } 
    });
    let title = r?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    title = (title || '').toString().replace(/[`*_#>\-]/g, '').replace(/\s+/g, ' ').trim();
    if (!title) { title = (userPrompt || '').toString().replace(/\s+/g, ' ').trim(); }
    const words = title.split(' ').filter(Boolean).slice(0, 6);
    title = words.join(' ');
    if (title.length > 60) title = title.slice(0, 60);
    if (!title) title = 'Nueva conversación';
    return title;
  } catch (e) {
    let t = (userPrompt || '').toString().replace(/[`*_#>\-]/g, '').replace(/\s+/g, ' ').trim();
    const words = t.split(' ').filter(Boolean).slice(0, 6);
    t = words.join(' ');
    if (!t) t = 'Nueva conversación';
    return t;
  }
}

// Endpoints de gestión de sesiones de chat
app.get("/chats/sessions", validateToken, async (req, res) => { 
  const userId = req.user.user_id; 
  const sessions = await getUserChatSessions(userId); 
  res.json({ sessions }); 
});

app.post("/chats/sessions", validateToken, async (req, res) => { 
  const userId = req.user.user_id; 
  const { name } = req.body || {}; 
  const id = await createChatSession(userId, (name && name.trim()) || undefined); 
  const session = await getChatSessionById(userId, id); 
  res.json({ session }); 
});

app.get("/chats/:sessionId/messages", validateToken, async (req, res) => { 
  const userId = req.user.user_id; 
  const sessionId = req.params.sessionId; 
  const session = await getChatSessionById(userId, sessionId); 
  if (!session) return res.status(404).json({ error: "Sesión no encontrada" }); 
  const messages = await getChatHistory(sessionId, 100); 
  res.json({ session, messages }); 
});

app.delete("/chats/:sessionId", validateToken, async (req, res) => { 
  const userId = req.user.user_id; 
  const sessionId = req.params.sessionId; 
  const success = await deleteChatSession(userId, sessionId); 
  if (!success) return res.status(404).json({ error: "Sesión no encontrada" }); 
  res.json({ message: "Sesión eliminada correctamente" }); 
});

app.delete("/chats", validateToken, async (req, res) => { 
  const userId = req.user.user_id; 
  const deletedCount = await deleteAllUserChatSessions(userId); 
  res.json({ message: `${deletedCount} conversaciones eliminadas correctamente` }); 
});

app.delete("/user/delete-account", validateToken, async (req, res) => { 
  const userId = req.user.user_id; 
  const success = await deleteAllUserData(userId); 
  if (!success) return res.status(500).json({ error: "Error al eliminar la cuenta" }); 
  res.json({ message: "Cuenta eliminada correctamente" }); 
});

// Endpoints de quizzes
app.post("/quizzes/generate", validateToken, async (req, res) => {
  const { topic, difficulty } = req.body;
  const userId = req.user.user_id;
  
  if (!topic || typeof topic !== 'string' || topic.trim().length < 3) {
    return res.status(400).json({ error: "Proporciona un tema válido (mín. 3 caracteres)" });
  }
  
  const level = (difficulty || 'intermedio').toLowerCase();
  const allowed = ['básico','basico','intermedio','avanzado','basic','intermediate','advanced'];
  const normalizedDifficulty = allowed.includes(level) ? level : 'intermedio';
  
  try {
    const response = await ai.models.generateContent({ 
      model: "gemini-2.5-flash", 
      contents: [{ 
        role: "user", 
        parts: [{ text: `Genera un quiz de practica en formato JSON estrictamente valido (sin markdown) sobre el tema: "${topic}".` }] 
      }], 
      generationConfig: { responseMimeType: "application/json" } 
    });
    
    const raw = response?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) return res.status(500).json({ error: "Respuesta vacía del modelo" });
    
    const parsed = tryParseQuiz(raw);
    if (!parsed) return res.status(500).json({ error: "No se pudo parsear JSON del modelo" });
    
    const normalized = normalizeQuizSchema(parsed, { topic, difficulty: normalizedDifficulty });
    const quizId = await createQuiz(userId, normalized.topic, normalizedDifficulty, normalized.questions);
    
    res.json({ quizId, quiz: { id: quizId, ...normalized } });
  } catch (error) {
    console.error("Error generando quiz con Gemini:", error);
    res.status(500).json({ error: "Error generando el quiz con Gemini" });
  }
});

app.get("/quizzes/recent", validateToken, async (req, res) => { 
  const userId = req.user.user_id; 
  const items = await getRecentQuizzes(userId, 12); 
  res.json({ items }); 
});

app.get("/quizzes/:id", validateToken, async (req, res) => { 
  const userId = req.user.user_id; 
  const quizId = req.params.id; 
  const row = await getQuizById(quizId, userId); 
  if (!row) return res.status(404).json({ error: "Quiz no encontrado" }); 
  
  let questions;
  if (typeof row.questions_json === 'string') { 
    try { questions = JSON.parse(row.questions_json); } 
    catch (e) { questions = []; } 
  } else if (Array.isArray(row.questions_json)) { 
    questions = row.questions_json; 
  } else { 
    questions = []; 
  } 
  
  res.json({ 
    id: row.id, 
    topic: row.topic, 
    difficulty: row.difficulty, 
    created_at: row.created_at, 
    questions 
  }); 
});

app.post("/quizzes/:id/attempt", validateToken, async (req, res) => { 
  const userId = req.user.user_id; 
  const quizId = req.params.id; 
  const { answers } = req.body; 
  
  if (!Array.isArray(answers) || answers.length !== 10) {
    return res.status(400).json({ error: "Debes enviar 10 respuestas" }); 
  }
  
  const row = await getQuizById(quizId, userId); 
  if (!row) return res.status(404).json({ error: "Quiz no encontrado" }); 
  
  let questions = []; 
  try { questions = JSON.parse(row.questions_json); } 
  catch {} 
  
  const total = questions.length;
  let score = 0; 
  questions.forEach((q, idx) => { 
    if (typeof q.correctIndex === 'number' && answers[idx] === q.correctIndex) score += 1; 
  }); 
  
  const attemptId = await recordQuizAttempt(quizId, userId, answers, score, total); 
  res.json({ attemptId, score, total, percentage: Math.round((score/total)*100) }); 
});

app.get("/progress/summary", validateToken, async (req, res) => { 
  const userId = req.user.user_id; 
  const summary = await getProgressSummary(userId); 
  res.json(summary); 
});

// 404 handlers
app.use((req, res, next) => {
  if (req.method === 'GET' && req.accepts('html')) {
    return res.status(404).sendFile(path.join(FRONTEND_DIR, 'template', '404.html'));
  }
  next();
});

app.use((req, res) => { 
  res.status(404).json({ error: 'Recurso no encontrado' }); 
});

export default app;