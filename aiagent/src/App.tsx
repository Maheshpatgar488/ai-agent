import { useEffect, useState } from "react";
import axios from "axios";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

const App = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // 🧠 Load chat memory
  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // 💾 Save memory
  useEffect(() => {
    if (messages.length > 0)
      localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const systemPrompt: Message = {
        role: "system",
        content:
          "You are Mahesh’s friendly AI coding assistant. You explain clearly, stay concise, and use emojis sometimes.",
      };

      const res = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.1-8b-instant",
          messages: [systemPrompt, ...messages, userMessage],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          },
        }
      );

      const botMessage = res.data.choices?.[0]?.message;
      if (botMessage?.content) {
        setMessages((prev) => [...prev, botMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "⚠️ No response from AI model." },
        ]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Error: Unable to reach the AI API." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const clearChat = () => {
    localStorage.removeItem("chatHistory");
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4 text-cyan-400">🤖 Mahesh’s AI Agent</h1>

      <div className="w-full max-w-2xl bg-slate-800/70 rounded-lg p-4 h-[70vh] overflow-y-auto shadow-lg">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 mt-20">
            👋 Start chatting with your AI assistant!
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`my-2 flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <p
              className={`px-4 py-2 rounded-2xl max-w-[75%] whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-cyan-600 text-white rounded-br-none"
                  : "bg-slate-700 text-gray-100 rounded-bl-none"
              }`}
            >
              {msg.content}
            </p>
          </div>
        ))}
        {loading && (
          <p className="text-gray-400 text-center mt-4">💭 Thinking...</p>
        )}
      </div>

      <div className="flex w-full max-w-2xl mt-4 gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask me anything..."
          className="flex-1 px-4 py-2 rounded bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-cyan-500 rounded-lg hover:bg-cyan-600 transition"
          disabled={loading}
        >
          Send
        </button>
        <button
          onClick={clearChat}
          className="px-3 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default App;
