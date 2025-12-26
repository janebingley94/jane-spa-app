import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const WORKER_URL = process.env.WORKER_URL as string;

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const initialMessages: Message[] = [
  {
    id: "m1",
    role: "assistant",
    text: "Hi Jane! Ask me anything, I can call our Cloudflare Worker."
  }
];

function App() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const canSend = input.trim().length > 0 && !isSending;

  const headerSubtitle = useMemo(() => {
    return WORKER_URL ? "Worker connected" : "Worker not configured";
  }, []);

  const sendMessage = async () => {
    if (!canSend) return;

    const content = input.trim();
    const userMessage: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text: content
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: content })
      });

      if (!response.ok) {
        throw new Error(`Worker error: ${response.status}`);
      }

      const data = (await response.json()) as { reply?: string };
      const replyText = data.reply || "Worker replied, but with no message.";

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: replyText
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: "assistant",
          text: "Worker is not reachable yet. Please try again after deployment."
        }
      ]);
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-cloud to-mist">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 shadow-sm">
            Cloudflare Chat
          </div>
          <h1 className="mt-4 text-4xl font-semibold text-ink sm:text-5xl">
            Jane SPA Assistant
          </h1>
          <p className="mt-2 max-w-2xl text-base text-slate-500">
            A minimal chat UI built with React, TypeScript, TailwindCSS, and a Cloudflare Worker.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {headerSubtitle}
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6">
          <section className="flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-xl">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div>
                  <h2 className="text-lg font-semibold text-ink">Conversation</h2>
                  <p className="text-sm text-slate-500">Realtime worker echo.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                  {messages.length} messages
                </span>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                        message.role === "user"
                          ? "bg-ink text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 bg-white px-6 py-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <button
                    className="rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200/70 transition hover:-translate-y-0.5 hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                    onClick={sendMessage}
                    disabled={!canSend}
                  >
                    {isSending ? "Sending..." : "Send"}
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Uses `WORKER_URL` from build-time environment variables.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);
root.render(<App />);
