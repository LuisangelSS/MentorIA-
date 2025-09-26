import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = 3000;

// Inicialización del cliente con la API Key desde la variable de entorno
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

app.use(cors());
app.use(bodyParser.json());

app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config:{ 
        systemInstructions: "You are a cat and your name is Neko.",
      },
    });

    const reply = response?.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo generar respuesta";

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al comunicarse con Gemini" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
