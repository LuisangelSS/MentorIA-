import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { marked } from "marked";
import { exec } from "child_process";
import { fileURLToPath } from "url";

// -----------------------------
// Importar funciones de la base de datos
// -----------------------------
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

// -----------------------------
// Cargar variables de entorno
// -----------------------------
dotenv.config({ path: path.resolve("./src/backend/.env") });

// -----------------------------
// Inicializar app y GoogleGenAI
// -----------------------------
const app = express();
const PORT = process.env.PORT || 3000;

// Rutas absolutas útiles
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FRONTEND_DIR = path.join(__dirname, "../frontend");

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });

if (!process.env.GOOGLE_API_KEY) {
    console.warn("⚠️  No se encontró la API Key. Revisa tu archivo .env");
}

app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta frontend
app.use(express.static(FRONTEND_DIR));

// -----------------------------
// Rutas para servir páginas HTML
// -----------------------------

// Ruta raíz - servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'template', 'index.html'));
});

// Ruta para la página de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'template', 'login.html'));
});

// Ruta para la página de registro
app.get('/register', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'template', 'registro.html'));
});

// Ruta para la aplicación principal
app.get('/app', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'template', 'app.html'));
});

// Ruta para el perfil de usuario
app.get('/profile', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'template', 'profile.html'));
});

// Ruta para quizzes
app.get('/quizzes', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'template', 'quizzes.html'));
});

// Ruta para dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'template', 'dashboard.html'));
});

// -----------------------------
// Endpoints de usuario / sesión
// -----------------------------
app.post("/register", (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
        const userId = registerUser(username, email, password);
        res.json({ message: "Usuario registrado correctamente", userId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al registrar usuario. Quizá el email o username ya existe." });
    }
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Faltan campos obligatorios" });

    const user = findUserByEmail(email);
    if (!user) return res.status(401).json({ error: "Usuario no encontrado" });

    if (!verifyPassword(password, user.password_hash)) {
        return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const session = createSession(user.id, 24); // token válido por 24 horas
    res.json({ token: session.token, expiresAt: session.expiresAt });
});

app.post("/logout", (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Falta token de sesión" });

    deleteSession(token);
    res.json({ message: "Logout exitoso" });
});

// Endpoint para obtener información del usuario autenticado
app.get("/user-info", (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: "Token de autorización requerido" });
    }

    const session = validateSession(token);
    if (!session) {
        return res.status(401).json({ error: "Token inválido o expirado" });
    }

    // Devolver información del usuario sin datos sensibles
    res.json({
        id: session.user_id,
        username: session.username,
    email: session.email
    });
});

// -----------------------------
// Endpoints de actualización de perfil
// -----------------------------

// Middleware para validar token
function validateToken(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: "Token de autorización requerido" });
    }

    const session = validateSession(token);
    if (!session) {
        return res.status(401).json({ error: "Token inválido o expirado" });
    }

    req.user = session;
    next();
}

// Actualizar nombre de usuario
app.put("/profile/username", validateToken, (req, res) => {
    const { newUsername } = req.body;

    if (!newUsername || newUsername.trim().length < 3) {
        return res.status(400).json({ error: "El nombre de usuario debe tener al menos 3 caracteres" });
    }

    try {
        const success = updateUsername(req.user.user_id, newUsername.trim());
        if (success) {
            res.json({ message: "Nombre de usuario actualizado correctamente" });
        } else {
            res.status(500).json({ error: "Error al actualizar el nombre de usuario" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar email
app.put("/profile/email", validateToken, (req, res) => {
    const { newEmail } = req.body;

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newEmail || !emailRegex.test(newEmail)) {
        return res.status(400).json({ error: "Email inválido" });
    }

    try {
        const success = updateEmail(req.user.user_id, newEmail.toLowerCase().trim());
        if (success) {
            res.json({ message: "Email actualizado correctamente" });
        } else {
            res.status(500).json({ error: "Error al actualizar el email" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar contraseña
app.put("/profile/password", validateToken, (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Se requiere la contraseña actual y la nueva" });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ error: "La nueva contraseña debe tener al menos 6 caracteres" });
    }

    try {
        // Verificar contraseña actual
        const isCurrentPasswordValid = verifyCurrentPassword(req.user.user_id, currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({ error: "Contraseña actual incorrecta" });
        }

        const success = updatePassword(req.user.user_id, newPassword);
        if (success) {
            res.json({ message: "Contraseña actualizada correctamente" });
        } else {
            res.status(500).json({ error: "Error al actualizar la contraseña" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar perfil completo (múltiples campos)
app.put("/profile/update-all", validateToken, (req, res) => {
    const { newUsername, newEmail, currentPassword, newPassword } = req.body;
    const userId = req.user.user_id;
    const errors = [];
    const updates = [];

    try {
        // Validar y actualizar username si se proporciona
        if (newUsername && newUsername.trim().length > 0) {
            if (newUsername.trim().length < 3) {
                errors.push("El nombre de usuario debe tener al menos 3 caracteres");
            } else {
                try {
                    const success = updateUsername(userId, newUsername.trim());
                    if (success) {
                        updates.push("nombre de usuario");
                    }
                } catch (error) {
                    errors.push(error.message);
                }
            }
        }

        // Validar y actualizar email si se proporciona
        if (newEmail && newEmail.trim().length > 0) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newEmail)) {
                errors.push("Email inválido");
            } else {
                try {
                    const success = updateEmail(userId, newEmail.toLowerCase().trim());
                    if (success) {
                        updates.push("email");
                    }
                } catch (error) {
                    errors.push(error.message);
                }
            }
        }

        // Validar y actualizar contraseña si se proporciona
        if (newPassword && newPassword.length > 0) {
            if (!currentPassword) {
                errors.push("Se requiere la contraseña actual para cambiarla");
            } else if (newPassword.length < 6) {
                errors.push("La nueva contraseña debe tener al menos 6 caracteres");
            } else {
                // Verificar contraseña actual
                const isCurrentPasswordValid = verifyCurrentPassword(userId, currentPassword);
                if (!isCurrentPasswordValid) {
                    errors.push("Contraseña actual incorrecta");
                } else {
                    const success = updatePassword(userId, newPassword);
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

        // Si hay cambios en contraseña, invalidar todas las sesiones
        if (updates.includes("contraseña")) {
            // Aquí podríamos invalidar todas las sesiones del usuario
            // Por simplicidad, solo devolvemos un mensaje
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

// -----------------------------
// Endpoint de chat con Gemini (con contexto) - autenticado y con soporte de sesiones específicas
// -----------------------------
app.post("/chat", validateToken, async (req, res) => {
    const { prompt, chatSessionId, stream = false } = req.body;
    const userId = req.user.user_id;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt requerido" });
    }

    try {
        // Resolver sesión de chat a usar
        let chatSession = null;
        if (chatSessionId) {
            const owned = getChatSessionById(userId, chatSessionId);
            if (!owned) return res.status(404).json({ error: "Sesión de chat no encontrada" });
            chatSession = owned;
        } else {
            chatSession = getOrCreateActiveChatSession(userId);
        }

        // Historial (últimos 10)
        let chatHistory = [];
        if (chatSession) {
            chatHistory = getChatHistory(chatSession.id, 10);
        }

        // Construir el array de contenidos con el historial
        const contents = [
                {
                    role: "model",
                    parts: [
                        {
                            text: `
                                  Eres MentorIA, un asistente de estudio inteligente y adaptable. Tu rol es actuar como un mentor académico profesional, enseñando, guiando, evaluando y ajustando tu forma de explicar según el desempeño, ritmo y comprensión del usuario.
                                  🧠 Rol y Propósito
                                  Enseña de manera clara, estructurada y progresiva cualquier tema académico solicitado.
                                  Evalúa la comprensión del usuario constantemente mediante preguntas estratégicas y análisis de respuestas.
                                  Adapta dinámicamente la complejidad, el estilo y el ritmo de tus explicaciones en función de su desempeño.
                                  Ofrece una experiencia personalizada que combine enseñanza, práctica y retroalimentación.

                                  🎯 Adaptación Dinámica
                                  Si el usuario responde correctamente con confianza, incrementa la complejidad gradualmente, usando vocabulario más técnico, problemas de aplicación y ejemplos avanzados.
                                  Si responde parcialmente o con dudas, reformula con ejemplos adicionales, analogías sencillas y pasos intermedios.
                                  Si responde de forma incorrecta o muestra confusión, retrocede un nivel, explica la base de forma simple y visual, y luego vuelve a avanzar.
                                  Si detectas errores repetidos, identifica la causa raíz (conceptual, terminológica o procedimental) y abórdala directamente.

                                  📝 Estilo de Enseñanza
                                  Usa un tono claro, paciente, motivador y profesional, evitando tecnicismos innecesarios cuando no corresponden al nivel del usuario.
                                  Divide explicaciones complejas en bloques cortos y progresivos.
                                  Refuerza conceptos con ejemplos prácticos, analogías cotidianas y ejercicios guiados.
                                  Finaliza cada bloque con una comprobación breve de comprensión (pregunta, mini quiz o solicitud de resumen).
                                  Anima al usuario cuando acierta y ofrece retroalimentación constructiva cuando se equivoca.

                                  🧩 Evaluación Continua
                                  Realiza un seguimiento interno del nivel de comprensión del usuario según sus respuestas, claridad y tiempo de reacción.
                                  Ajusta el ritmo (más pausado o ágil), el tipo de explicación (conceptual, práctica, visual, técnica) y recomienda material complementario si es necesario.
                                  Nunca asumas comprensión completa sin evidencia.

                                  🧰 Capacidades Esperadas
                                  Explicar temas en diferentes niveles de complejidad.
                                  Generar ejemplos, ejercicios personalizables, quizzes interactivos y resúmenes.
                                  Recordar y usar el historial de interacción dentro de la sesión para adaptar la enseñanza.
                                  Saber cuándo reforzar teoría y cuándo avanzar a la práctica.

                                  🚫 Restricciones
                                  No inventes información académica incorrecta.
                                  No uses lenguaje excesivamente coloquial en explicaciones técnicas.
                                  No avances si el usuario no domina la base previa.
                                  No ignores señales de confusión; adáptate siempre.

                                  🧭 Ejemplo de Comportamiento Adaptativo
                                  Usuario: "La aceleración es la distancia entre dos puntos, ¿verdad?"
                                  MentorIA: "Casi, pero no exactamente. La aceleración no mide distancia, mide cómo cambia la velocidad con el tiempo.
                                  Imagina que vas en bicicleta y cada segundo pedaleas más fuerte. Tu velocidad aumenta cada segundo — eso es aceleración.
                                  Vamos a repasarlo con un ejemplo sencillo…"
              `,
                        },
                    ],
            }
        ];

        // Agregar historial de conversación
        chatHistory.forEach(msg => {
            contents.push({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            });
        });

        // Agregar el mensaje actual
        contents.push({
            role: "user",
            parts: [{ text: prompt }]
        });

        if (stream) {
            // Configurar headers para streaming
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            let fullResponse = '';
            let isFirstChunk = true;

            try {
                const stream = await ai.models.generateContentStream({
                    model: "gemini-2.5-flash",
                    contents: contents,
                });

                for await (const chunk of stream) {
                    const chunkText = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (chunkText) {
                        fullResponse += chunkText;
                        
                        // Enviar el chunk al cliente
                        if (isFirstChunk) {
                            res.write(`data: ${JSON.stringify({ 
                                type: 'start', 
                                chatSessionId: chatSession?.id,
                                sessionName: chatSession?.session_name 
                            })}\n\n`);
                            isFirstChunk = false;
                        }
                        
                        res.write(`data: ${JSON.stringify({ 
                            type: 'chunk', 
                            text: chunkText 
                        })}\n\n`);
                    }
                }

                // Enviar señal de finalización
                res.write(`data: ${JSON.stringify({ 
                    type: 'end', 
                    fullText: fullResponse 
                })}\n\n`);

                // Guardar mensajes en la base de datos
                if (chatSession) {
                    addChatMessage(chatSession.id, 'user', prompt);
                    addChatMessage(chatSession.id, 'assistant', fullResponse);
                }

                // Autonombrar la sesión si aún tiene el nombre por defecto
                try {
                    if (chatSession && (!chatSession.session_name || /^Nueva convers/i.test(chatSession.session_name))) {
                        const title = await generateChatTitle(prompt, fullResponse);
                        if (title) {
                            updateChatSessionName(chatSession.id, title);
                            chatSession.session_name = title;
                        }
                    }
                } catch (e) {
                    // No bloquear la respuesta por fallo en titulación
                }

                res.end();
            } catch (streamError) {
                console.error("Error en streaming:", streamError);
                res.write(`data: ${JSON.stringify({ 
                    type: 'error', 
                    error: 'Error en el streaming' 
                })}\n\n`);
                res.end();
            }
        } else {
            // Respuesta tradicional (no streaming)
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: contents,
        });

        const rawReply = response?.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo generar respuesta";
        const reply = marked.parse(rawReply);

            // Guardar mensajes en la base de datos
            if (chatSession) {
                addChatMessage(chatSession.id, 'user', prompt);
                addChatMessage(chatSession.id, 'assistant', rawReply);
            }

            // Autonombrar la sesión si aún tiene el nombre por defecto
            try {
                if (chatSession && (!chatSession.session_name || /^Nueva convers/i.test(chatSession.session_name))) {
                    const title = await generateChatTitle(prompt, rawReply);
                    if (title) {
                        updateChatSessionName(chatSession.id, title);
                        chatSession.session_name = title;
                    }
                }
            } catch (e) {
                // No bloquear la respuesta por fallo en titulación
            }

            res.json({ reply, chatSessionId: chatSession?.id, sessionName: chatSession?.session_name });
        }
    } catch (error) {
        console.error("Error al comunicarse con Gemini:", error);
        if (stream) {
            res.write(`data: ${JSON.stringify({ 
                type: 'error', 
                error: 'Error al comunicarse con Gemini' 
            })}\n\n`);
            res.end();
        } else {
        res.status(500).json({ error: "Error al comunicarse con Gemini" });
        }
    }
});

// -----------------------------
// Utilidades para parsear y normalizar JSON de Gemini
// -----------------------------

function extractJson(text) {
  if (!text || typeof text !== 'string') return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  let candidate = fenced ? fenced[1] : text;
  // Recortar al primer {...último}
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
    if (typeof parsed === 'string') {
      return JSON.parse(parsed);
    }
    return parsed;
  } catch {
    const extracted = extractJson(text);
    if (!extracted) return null;
    try {
      const parsed2 = JSON.parse(extracted);
      if (typeof parsed2 === 'string') {
        return JSON.parse(parsed2);
      }
      return parsed2;
    } catch {
      return null;
    }
  }
}

function normalizeQuizSchema(quiz, { topic, difficulty }) {
  const out = { topic: quiz?.topic || topic, difficulty: (quiz?.difficulty || difficulty || '').toString(), questions: [] };
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

  // Asegurar exactamente 10 preguntas
  while (out.questions.length < 10) {
    out.questions.push(makePlaceholder(out.questions.length));
  }
  if (out.questions.length > 10) out.questions = out.questions.slice(0, 10);

  // Normalizar ids secuenciales
  out.questions = out.questions.map((q, idx) => ({ ...q, id: `q${idx + 1}` }));

  return out;
}

// -----------------------------
// Helper: generar título breve para la sesión
// -----------------------------
async function generateChatTitle(userPrompt, rawAssistantReply) {
  // Prompt breve para el modelo: título conciso en español (máx. 6 palabras)
  const instruction = `Crea un título muy breve (máximo 6 palabras) en español que resuma el tema de esta conversación de estudio. Devuelve solo el título, sin comillas ni puntuación extra.`;
  const contextText = `Usuario: ${userPrompt}\nAsistente: ${rawAssistantReply}`.slice(0, 1000);
  try {
    const r = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: 'user', parts: [{ text: `${instruction}\n\n${contextText}` }] }
      ],
      generationConfig: { temperature: 0.2 }
    });
    let title = r?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    title = (title || '').toString()
      .replace(/[`*_#>\-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!title) {
      // Fallback simple: usar primeras palabras del prompt
      title = (userPrompt || '').toString().replace(/\s+/g, ' ').trim();
    }
    // Limitar a ~50 caracteres y a 6 palabras
    const words = title.split(' ').filter(Boolean).slice(0, 6);
    title = words.join(' ');
    if (title.length > 60) title = title.slice(0, 60);
    if (!title) title = 'Nueva conversación';
    return title;
  } catch (e) {
    // Fallback: derivado del prompt
    let t = (userPrompt || '').toString().replace(/[`*_#>\-]/g, '').replace(/\s+/g, ' ').trim();
    const words = t.split(' ').filter(Boolean).slice(0, 6);
    t = words.join(' ');
    if (!t) t = 'Nueva conversación';
    return t;
  }
}

// -----------------------------
// Endpoints de gestión de sesiones de chat
// -----------------------------

// Listar sesiones del usuario
app.get("/chats/sessions", validateToken, (req, res) => {
  const userId = req.user.user_id;
  const sessions = getUserChatSessions(userId);
  res.json({ sessions });
});

// Crear nueva sesión
app.post("/chats/sessions", validateToken, (req, res) => {
  const userId = req.user.user_id;
  const { name } = req.body || {};
  const id = createChatSession(userId, (name && name.trim()) || undefined);
  const session = getChatSessionById(userId, id);
  res.json({ session });
});

// Obtener mensajes de una sesión
app.get("/chats/:sessionId/messages", validateToken, (req, res) => {
  const userId = req.user.user_id;
  const sessionId = parseInt(req.params.sessionId, 10);
  if (Number.isNaN(sessionId)) return res.status(400).json({ error: "ID inválido" });
  const session = getChatSessionById(userId, sessionId);
  if (!session) return res.status(404).json({ error: "Sesión no encontrada" });
  const messages = getChatHistory(sessionId, 100);
  res.json({ session, messages });
});

// Eliminar una sesión de chat específica
app.delete("/chats/:sessionId", validateToken, (req, res) => {
  const userId = req.user.user_id;
  const sessionId = parseInt(req.params.sessionId, 10);
  if (Number.isNaN(sessionId)) return res.status(400).json({ error: "ID inválido" });
  
  const success = deleteChatSession(userId, sessionId);
  if (!success) return res.status(404).json({ error: "Sesión no encontrada" });
  
  res.json({ message: "Sesión eliminada correctamente" });
});

// Eliminar todas las conversaciones del usuario
app.delete("/chats", validateToken, (req, res) => {
  const userId = req.user.user_id;
  const deletedCount = deleteAllUserChatSessions(userId);
  res.json({ message: `${deletedCount} conversaciones eliminadas correctamente` });
});

// Eliminar todos los datos del usuario (cuenta completa)
app.delete("/user/delete-account", validateToken, (req, res) => {
  const userId = req.user.user_id;
  const success = deleteAllUserData(userId);
  if (!success) return res.status(500).json({ error: "Error al eliminar la cuenta" });
  
  res.json({ message: "Cuenta eliminada correctamente" });
});

// -----------------------------
// Endpoints de quizzes con Gemini
// -----------------------------

// Generar un quiz de 10 preguntas con Gemini y guardarlo
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
      contents: [
        {
          role: "user",
          parts: [{
            text: `Genera un quiz de practica en formato JSON estrictamente valido (sin markdown) sobre el tema: "${topic}".
- Deben ser exactamente 10 preguntas.
- Dificultad: ${normalizedDifficulty}.
- Esquema del JSON:
{
  "topic": "string",
  "difficulty": "basico|intermedio|avanzado",
  "questions": [
    {
      "id": "q1",
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": 0,
      "explanation": "string"
    }
  ]
}
- Asegurate de que options tenga 4 opciones y correctIndex sea el indice (0-3).
- No incluyas nada fuera del JSON.`
          }]
        }
      ],
      generationConfig: { responseMimeType: "application/json" }
    });

    const raw = response?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) return res.status(500).json({ error: "Respuesta vacía del modelo" });

    const parsed = tryParseQuiz(raw);
    if (!parsed) {
      return res.status(500).json({ error: "No se pudo parsear JSON del modelo" });
    }

    const normalized = normalizeQuizSchema(parsed, { topic, difficulty: normalizedDifficulty });

    // Guardar en BD con preguntas normalizadas
    const quizId = createQuiz(userId, normalized.topic, normalizedDifficulty, normalized.questions);

    res.json({ quizId, quiz: { id: quizId, ...normalized } });
  } catch (error) {
    console.error("Error generando quiz con Gemini:", error);
    res.status(500).json({ error: "Error generando el quiz con Gemini" });
  }
});

// Listar quizzes recientes del usuario
app.get("/quizzes/recent", validateToken, (req, res) => {
  const userId = req.user.user_id;
  const items = getRecentQuizzes(userId, 12);
  res.json({ items });
});

// Obtener un quiz específico del usuario
app.get("/quizzes/:id", validateToken, (req, res) => {
  const userId = req.user.user_id;
  const quizId = parseInt(req.params.id, 10);
  if (Number.isNaN(quizId)) return res.status(400).json({ error: "ID inválido" });

  const row = getQuizById(quizId, userId);
  if (!row) return res.status(404).json({ error: "Quiz no encontrado" });

  let questions;
  try { questions = JSON.parse(row.questions_json); } catch { questions = []; }
  res.json({ id: row.id, topic: row.topic, difficulty: row.difficulty, created_at: row.created_at, questions });
});

// Enviar intento de quiz y calcular puntaje
app.post("/quizzes/:id/attempt", validateToken, (req, res) => {
  const userId = req.user.user_id;
  const quizId = parseInt(req.params.id, 10);
  const { answers } = req.body; // array de indices seleccionados
  if (Number.isNaN(quizId)) return res.status(400).json({ error: "ID inválido" });
  if (!Array.isArray(answers) || answers.length !== 10) {
    return res.status(400).json({ error: "Debes enviar 10 respuestas" });
  }

  const row = getQuizById(quizId, userId);
  if (!row) return res.status(404).json({ error: "Quiz no encontrado" });

  let questions = [];
  try { questions = JSON.parse(row.questions_json); } catch { /* noop */ }

  const total = questions.length;
  let score = 0;
  questions.forEach((q, idx) => {
    if (typeof q.correctIndex === 'number' && answers[idx] === q.correctIndex) score += 1;
  });

  const attemptId = recordQuizAttempt(quizId, userId, answers, score, total);
  res.json({ attemptId, score, total, percentage: Math.round((score/total)*100) });
});

// Resumen de progreso del usuario (para dashboard)
app.get("/progress/summary", validateToken, (req, res) => {
  const userId = req.user.user_id;
  const summary = getProgressSummary(userId);
  res.json(summary);
});

// -----------------------------
// Función para abrir el navegador
// -----------------------------
function openBrowser() {
    const serverUrl = `http://localhost:${PORT}`;

    let command;
    switch (process.platform) {
    case 'darwin': // macOS
            command = `open "${serverUrl}"`;
            break;
    case 'win32': // Windows
            command = `start "" "${serverUrl}"`;
            break;
        default: // Linux y otros
            command = `xdg-open "${serverUrl}"`;
            break;
    }

  exec(command, (error) => {
        if (error) {
      console.log('⚠️  No se pudo abrir el navegador automáticamente');
            console.log(`📖 Abre manualmente: ${serverUrl}`);
        } else {
            console.log(`🌐 Navegador abierto automáticamente en ${serverUrl}`);
        }
    });
}

// 404 para rutas no encontradas (solo HTML/GET)
app.use((req, res, next) => {
  if (req.method === 'GET' && req.accepts('html')) {
    return res.status(404).sendFile(path.join(FRONTEND_DIR, 'template', '404.html'));
    }
    next();
});

// 404 genérico para otros tipos (JSON/text)
app.use((req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
});

// -----------------------------
// Iniciar servidor
// -----------------------------
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);

    // Abrir el navegador automáticamente
    setTimeout(() => {
        openBrowser();
    }, 1000);
});
