import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";

// Cargar variables de entorno desde el archivo .env en src/backend
dotenv.config({ path: path.resolve("./src/backend/.env") });

const app = express();
const PORT = process.env.PORT || 3000; // permite usar otro puerto si 3000 está ocupado

// Inicialización del cliente con la API Key desde la variable de entorno
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });

if (!process.env.GOOGLE_API_KEY) {
  console.warn("⚠️  No se encontró la API Key. Revisa tu archivo .env");
}

app.use(cors());
app.use(bodyParser.json());

// Endpoint para recibir prompts y responder con Gemini
app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        // Instrucciones de MentorIA
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
        // Entrada del usuario
        { 
          role: "user", 
          parts: [{ text: prompt }] 
        }
      ]
    });

    const reply = response?.candidates?.[0]?.content?.parts?.[0]?.text || 
                  "No se pudo generar respuesta";

    res.json({ reply });

  } catch (error) {
    console.error("Error al comunicarse con Gemini:", error);
    res.status(500).json({ error: "Error al comunicarse con Gemini" });
  }
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
