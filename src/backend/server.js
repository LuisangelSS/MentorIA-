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
  verifyCurrentPassword
} from "./db.js"; // <- db.js está en la misma carpeta que server.js

// -----------------------------
// Cargar variables de entorno
// -----------------------------
dotenv.config({ path: path.resolve("./src/backend/.env") });

// -----------------------------
// Inicializar app y GoogleGenAI
// -----------------------------
const app = express();
const PORT = process.env.PORT || 3000;

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });

if (!process.env.GOOGLE_API_KEY) {
  console.warn("⚠️  No se encontró la API Key. Revisa tu archivo .env");
}

app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta frontend
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), '../frontend')));

// -----------------------------
// Rutas para servir páginas HTML
// -----------------------------

// Ruta raíz - redirigir a index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(path.dirname(fileURLToPath(import.meta.url)), '../frontend/index.html'));
});

// Ruta para la página de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(path.dirname(fileURLToPath(import.meta.url)), '../frontend/login.html'));
});

// Ruta para la página de registro
app.get('/register', (req, res) => {
  res.sendFile(path.join(path.dirname(fileURLToPath(import.meta.url)), '../frontend/registro.html'));
});

// Ruta para la aplicación principal
app.get('/app', (req, res) => {
  res.sendFile(path.join(path.dirname(fileURLToPath(import.meta.url)), '../frontend/app.html'));
});

// Ruta para el perfil de usuario
app.get('/profile', (req, res) => {
  res.sendFile(path.join(path.dirname(fileURLToPath(import.meta.url)), '../frontend/profile.html'));
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
// Endpoint de chat con Gemini
// -----------------------------
app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { 
          role: "model", 
          parts: [
            {
              text: `
                Eres una IA educativa llamada MentorIA. Tu objetivo es ayudar a los usuarios
                a aprender sobre temas que no conocen o quieren entender. 
                Siempre que un usuario quiera aprender algo, antes de explicar, debes preguntar
                primero qué nivel de dificultad desea que se lo expliques: básico, intermedio o avanzado.
              `
            }
          ]
        },
        { role: "user", parts: [{ text: prompt }] }
      ]
    });

    const rawReply = response?.candidates?.[0]?.content?.parts?.[0]?.text || 
                     "No se pudo generar respuesta";
    const reply = marked.parse(rawReply);
    res.json({ reply });

  } catch (error) {
    console.error("Error al comunicarse con Gemini:", error);
    res.status(500).json({ error: "Error al comunicarse con Gemini" });
  }
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
