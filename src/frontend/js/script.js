const form = document.querySelector("form");
const input = form.querySelector("input");
const button = form.querySelector("button");
const chatBox = document.getElementById("chat-box");
const chatTitle = document.getElementById("chat-title");
const chatLogo = document.getElementById("chat-logo");

button.addEventListener("click", async (e) => {
  e.preventDefault();
  const prompt = input.value.trim();
  if (!prompt) return;

  // Ocultar el título la primera vez que se envía un mensaje
  if (chatTitle) {
    chatTitle.style.display = "none";
    chatLogo.style.display = "none";
  }

  // Mostrar prompt en el chat
  const userMsg = document.createElement("div");
  userMsg.className = "animate-fadeIn w-[800px] ml-10 text-end font-bold text-text  p-5 bg-background-card rounded-lg mb-8 px-4 sm:px-6";
  userMsg.innerHTML = prompt;
  chatBox.appendChild(userMsg);

  input.value = "";

  try {
const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();

    const botMsg = document.createElement("div");
    botMsg.className = "animate-fadeIn w-[900px] mr-10 text-start text-text mb-8 px-4 p-5 rounded-lg sm:px-6 ";
    botMsg.innerHTML = data.reply;
    chatBox.appendChild(botMsg);

    // Mantener el scroll al final
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    console.error(err);
  }
});
