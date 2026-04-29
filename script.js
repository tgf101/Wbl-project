document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "AIzaSyDyXF_RJ-scGLuwBcpzyeweEJ1iEvlUdfQ";

  const chatToggle = document.getElementById("chat-toggle");
  const chatContainer = document.getElementById("chat-container");
  const sendBtn = document.getElementById("send-btn");
  const messageInput = document.getElementById("message-input");
  const messages = document.getElementById("messages");

  function addMessage(text, sender) {
    const newMessage = document.createElement("div");
    newMessage.classList.add("message", sender);
    newMessage.textContent = text;
    messages.appendChild(newMessage);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const typingMessage = document.createElement("div");
    typingMessage.classList.add("message", "bot");
    typingMessage.textContent = "Typing...";
    messages.appendChild(typingMessage);
    messages.scrollTop = messages.scrollHeight;
    return typingMessage;
  }


  async function getBotReply(userMessage) {
        const churchInfo =
          "Bethany Community Church information:" +
          "- Sunday service starts at 10:30am." +
          "- Service location: St Goerge's School Assembly Hall, Sun Lane, Harpenden, AL5 4TD." +
          "- Church office phone number: 01582 318 171." +
          "- The upcoming events are Catalyst festival 2026 from May 23rd to May 26th. Newday 2026 from 27th July to 1st of August.";
    const prompt =
      "You are ChurchBot for Bethany Community Church.\n\n" +
      "Use the church website content below when answering questions about the church.\n" +
      "If the user asks a general question, answer normally in a helpful way.\n" +
      "Do not invent church facts that are not supported by the website content.\n\n" +
          churchInfo +                                           
      "User question:" + userMessage;

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      apiKey;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Gemini API error:", data);
        return "There was a problem getting a response.";
      }

        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No reply.";
    } catch (error) {
      console.error("Gemini fetch error:", error);
      return "Something went wrong.";
    }
  }

  async function sendMessage() {
    const userText = messageInput.value.trim();

    if (userText === "") {
      return;
    }

    addMessage(userText, "user");
    messageInput.value = "";

    const typing = showTyping();
    const reply = await getBotReply(userText);
    typing.remove();

    addMessage(reply, "bot");
    localStorage.setItem("chatHistory", messages.innerHTML);
  }

  chatToggle.addEventListener("click", function () {
    if (chatContainer.classList.contains("closed")) {
      chatContainer.classList.remove("closed");
      chatContainer.classList.add("open");
      chatToggle.textContent = "✖";
    } else {
      chatContainer.classList.remove("open");
      chatContainer.classList.add("closed");
      chatToggle.textContent = "💬";
    }
  });

  sendBtn.addEventListener("click", sendMessage);

  messageInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  });

  const savedChat = localStorage.getItem("chatHistory");

  if (savedChat) {
    messages.innerHTML = savedChat;
  } else {
    addMessage("Hi! Ask me about Bethany Community Church or anything else.", "bot");
  }
});
