import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { marked } from "marked";

// -----------------------------
// Importar funciones de la base de datos
// -----------------------------
import {
  registerUser,
  findUserByEmail,
  verifyPassword,
  createSession,
  validateSession,
  deleteSession
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
// Iniciar servidor
// -----------------------------
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
