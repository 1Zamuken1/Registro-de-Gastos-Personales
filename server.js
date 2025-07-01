require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
const app = express();

// Servir archivos estáticos - todas las carpetas de tu estructura
app.use(express.static("assets"));           // Para CSS, JS, imágenes, iconos
app.use(express.static("chatBot"));          // Para archivos del chatbot
app.use(express.static("components"));       // Para componentes
app.use(express.static("Landing-pages"));    // Para archivos HTML de landing pages  
app.use(express.static("node_modules"));     // Para dependencias (si es necesario)
app.use(express.static("views"));            // Para otros archivos HTML
app.use(express.static("."));                // Carpeta raíz como fallback
app.use(express.json());

// Ruta principal - servir tu Landing.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Landing-pages', 'Landing.html'));
});

// API del chatbot
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "HTTP-Referer": `http://localhost:5500`,
        "X-Title": "ChatBot Local"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: userMessage }]
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error de OpenRouter:", data);
      return res.status(500).json({
        reply: data.error?.message || "Error desde OpenRouter",
      });
    }

    const reply = data.choices?.[0]?.message?.content || "Sin respuesta de la IA.";
    res.json({ reply });

  } catch (err) {
    console.error("Error general:", err);
    res.status(500).json({ reply: "Error general del servidor" });
  }
});

const PORT = 5500;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📁 Sirviendo archivos desde múltiples carpetas:`);
  console.log(`   - assets/ (CSS, JS, imágenes, iconos)`);
  console.log(`   - chatBot/ (archivos del chatbot)`);
  console.log(`   - components/ (componentes)`);
  console.log(`   - Landing-pages/ (HTML landing)`);
  console.log(`   - views/ (otros HTML)`);
  console.log(`   - node_modules/ (dependencias)`);
});