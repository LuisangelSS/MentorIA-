const form = document.querySelector("form");
const input = form.querySelector("input");
const button = form.querySelector("button");
const chatBox = document.getElementById("chat-box");
const chatTitle = document.getElementById("chat-title");

button.addEventListener("click", async (e) => {
  e.preventDefault();
  const prompt = input.value.trim();
  if (!prompt) return;

  // Ocultar el título la primera vez que se envía un mensaje
  if (chatTitle) {
    chatTitle.style.display = "none";
  }

  // Mostrar prompt en el chat
  const userMsg = document.createElement("p");
  userMsg.className = "font-bold text-blue-300 mb-2 px-4 sm:px-6";
  userMsg.textContent = "Tú: " + prompt;
  chatBox.appendChild(userMsg);

  input.value = "";

  try {
    const res = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();

    const botMsg = document.createElement("p");
    botMsg.className = "text-green-300 mb-4 px-4 sm:px-6";
    botMsg.textContent = "MentorIA: " + data.reply;
    chatBox.appendChild(botMsg);

    // Mantener el scroll al final
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    console.error(err);
  }
});
