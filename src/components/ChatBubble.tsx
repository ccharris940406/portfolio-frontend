import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { PUBLIC_AI_API_URL } from "astro:env/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(crypto.randomUUID());

  useEffect(() => {
    const show = setTimeout(() => setShowTooltip(true), 3000);
    const hide = setTimeout(() => setShowTooltip(false), 9000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch(`${PUBLIC_AI_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, session_id: sessionId.current }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message ?? data.response ?? "..." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Lo siento, hubo un error al conectar con la IA.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex items-end gap-2">
        <div
          className={`transition-all duration-300 ${
            showTooltip && !isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          <div
            className="relative rounded-2xl rounded-br-none px-4 py-2 text-sm font-medium shadow-lg whitespace-nowrap"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "white",
            }}
          >
            ¿Tienes dudas sobre Carlos? 👋
            <span
              className="absolute -bottom-2 right-3 w-0 h-0"
              style={{
                borderLeft: "8px solid transparent",
                borderRight: "0px solid transparent",
                borderTop: `8px solid var(--color-primary)`,
              }}
            />
          </div>
        </div>

        <button
          onClick={() => { setIsOpen((prev) => !prev); setShowTooltip(false); }}
          aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-110 cursor-pointer shrink-0"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <i
            className={`fa-solid ${isOpen ? "fa-xmark" : "fa-comment-dots"} text-white text-xl`}
          />
        </button>
      </div>

      <div
        className={`fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
        style={{
          backgroundColor: "var(--color-background)",
          border: "1px solid var(--color-border)",
          height: "30rem",
        }}
      >
        <div
          className="px-4 py-3 flex items-center gap-3 shrink-0"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <i className="fa-solid fa-robot text-white text-sm" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Carlos AI</p>
            <p className="text-white/70 text-xs">Pregúntame sobre Carlos</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.length === 0 && (
            <p
              className="text-center text-sm mt-4"
              style={{ color: "var(--color-muted)" }}
            >
              ¡Hola! Soy la IA de Carlos. ¿Qué quieres saber sobre él?
            </p>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className="max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed"
                style={
                  msg.role === "user"
                    ? { backgroundColor: "var(--color-primary)", color: "white" }
                    : {
                        backgroundColor: "var(--color-cards)",
                        color: "var(--color-text)",
                      }
                }
              >
                {msg.role === "user" ? (
                  msg.content
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      h1: ({ children }) => <h1 className="text-base font-bold mt-2 mb-1">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-sm font-bold mt-2 mb-1">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-semibold mt-1 mb-1">{children}</h3>,
                      ul: ({ children }) => <ul className="list-disc list-inside my-1 space-y-0.5">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside my-1 space-y-0.5">{children}</ol>,
                      li: ({ children }) => <li className="ml-1">{children}</li>,
                      code: ({ children }) => (
                        <code
                          className="rounded px-1 py-0.5 text-xs font-mono"
                          style={{ backgroundColor: "var(--color-border)" }}
                        >
                          {children}
                        </code>
                      ),
                      a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="underline opacity-80 hover:opacity-100">
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div
                className="rounded-2xl px-4 py-3"
                style={{ backgroundColor: "var(--color-cards)" }}
              >
                <span className="flex gap-1 items-center">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{
                        backgroundColor: "var(--color-muted)",
                        animationDelay: `${delay}ms`,
                      }}
                    />
                  ))}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div
          className="px-3 py-3 flex gap-2 shrink-0"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Escribe tu mensaje..."
            className="flex-1 rounded-xl px-3 py-2 text-sm outline-none"
            style={{
              backgroundColor: "var(--color-cards)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed shrink-0"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <i className="fa-solid fa-paper-plane text-white text-sm" />
          </button>
        </div>
      </div>
    </>
  );
}
