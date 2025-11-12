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
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-cyan-400 px-2">🤖 Mahesh's AI Agent</h1>

        <div className="w-full max-w-3xl bg-slate-800/70 rounded-lg p-3 sm:p-4 md:p-6 h-[60vh] sm:h-[65vh] md:h-[70vh] overflow-y-auto shadow-lg">
        {messages.length === 0 && (
         <p className="text-center text-gray-400 mt-12 sm:mt-16 md:mt-20 text-sm sm:text-base px-4">
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
            className={`px-3 sm:px-4 py-2 rounded-2xl max-w-[85%] sm:max-w-[80%] md:max-w-[75%] text-sm sm:text-base whitespace-pre-wrap ${
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
         <p className="text-gray-400 text-center mt-3 sm:mt-4 text-sm sm:text-base">💭 Thinking...</p>
        )}
      </div>

  <div className="w-full max-w-3xl mt-3 sm:mt-4 md:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3 px-2 sm:px-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask me anything..."
            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition placeholder-gray-500 min-w-0"
        />
        <button
          onClick={handleSend}
            className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-cyan-500 rounded-lg hover:bg-cyan-600 active:bg-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium whitespace-nowrap"
          disabled={loading}
        >
          Send
        </button>
        <button
          onClick={clearChat}
          className="px-3 sm:px-4 py-2 sm:py-2.5 text-base sm:text-lg bg-red-500 rounded-lg hover:bg-red-600 active:bg-red-700 transition font-medium whitespace-nowrap"
          title="Clear chat history"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default App;
