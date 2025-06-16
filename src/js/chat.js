// chat.js
// Uses Socket.IO for real-time admin ↔ user chat

let socket;

document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role") || "guest";
  const userId = localStorage.getItem("userId") || "anonymous";

  // Connect to socket.io
  socket = io(); // automatically connects to the same origin

  // USER SIDE LOGIC
  if (role === "user") {
    socket.emit("user-connected", userId);

    const chatBox = document.getElementById("chat-box");
    const messageInput = document.getElementById("message-input");
    const sendBtn = document.getElementById("send-btn");

    if (sendBtn) {
      sendBtn.addEventListener("click", () => {
        const message = messageInput.value.trim();
        if (message !== "") {
          socket.emit("send-to-admin", { userId, message });
          appendMessage("You", message, chatBox);
          messageInput.value = "";
        }
      });
    }

    socket.on("receive-message", ({ from, message }) => {
      appendMessage(from === "admin" ? "Admin" : from, message, chatBox);
    });
  }

  // ADMIN SIDE LOGIC
  if (role === "admin") {
    socket.emit("admin-connected");

    const userList = document.getElementById("userList");
    const chatBox = document.getElementById("chatBox");
    const messageInput = document.getElementById("adminMessage");
    const sendBtn = document.getElementById("sendAdminMsg");

    let currentUser = null;

    // Load users from chat history (future enhancement)
    // For now, wait for user to message first

    socket.on("receive-message", ({ from, message }) => {
      currentUser = from;
      appendMessage(from, message, chatBox);
    });

    if (sendBtn) {
      sendBtn.addEventListener("click", () => {
        const message = messageInput.value.trim();
        if (message !== "" && currentUser) {
          socket.emit("send-to-user", { to: currentUser, message });
          appendMessage("You", message, chatBox);
          messageInput.value = "";
        }
      });
    }
  }

  function appendMessage(sender, text, container) {
    const msg = document.createElement("div");
    msg.className = `chat-message ${sender === "You" || sender === "Admin" ? "admin" : "user"}`;
    msg.innerHTML = `
      <p>${text}</p>
      <span class="timestamp">${sender}</span>
    `;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }
});
