import { useState } from "react";

// A mock "Quark Chat" chat window (dark theme).
type Message = { role: "user" | "assistant"; text: string };

type ChatGroup = { label: string; chats: string[] };

const chatGroups: ChatGroup[] = [
  {
    label: "Today",
    chats: ["Quantum tunneling", "Tailwind dark theme setup"],
  },
  {
    label: "Previous 7 days",
    chats: [
      "Rust ownership explained",
      "SQL window functions",
      "Regex for email parsing",
      "Trip itinerary: Kyoto",
    ],
  },
];

// The active chat (first one) is highlighted in the sidebar.
const activeChat = chatGroups[0].chats[0];

const messages: Message[] = [
  {
    role: "user",
    text: "Explain quantum tunneling in one sentence.",
  },
  {
    role: "assistant",
    text: "Quantum tunneling is the phenomenon where a particle passes through an energy barrier it classically shouldn't have enough energy to cross, because its wavefunction has a small but nonzero probability of existing on the other side.",
  },
  {
    role: "user",
    text: "Where does that actually matter in the real world?",
  },
  {
    role: "assistant",
    text: "It's essential to how the sun fuses hydrogen, how flash memory and tunnel diodes work, and how scanning tunneling microscopes image individual atoms — all rely on particles crossing barriers they otherwise couldn't.",
  },
];

export default function ChatScreen() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-full w-full bg-[#0a0a0a] text-neutral-200">
      {/* Sidebar with other chats */}
      {sidebarOpen && (
      <aside className="flex w-64 flex-none flex-col border-r border-neutral-800 bg-black">
        {/* Close button — a small arrow head */}
        <div className="flex justify-end px-3 pt-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="text-neutral-500 transition hover:text-neutral-200"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none">
              <path
                d="M12 5l-5 5 5 5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="px-3 pb-3 pt-2">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg border border-neutral-800 px-3 py-2 text-sm text-neutral-200 transition hover:border-green-500/40 hover:bg-neutral-900"
          >
            <svg className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 4v12M4 10h12"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
            New chat
          </button>
        </div>

        <nav className="flex-1 overflow-auto px-2 pb-3">
          {chatGroups.map((group) => (
            <div key={group.label} className="mb-3">
              <div className="px-2 py-1 text-xs font-medium text-neutral-600">
                {group.label}
              </div>
              {group.chats.map((chat) => {
                const isActive = chat === activeChat;
                return (
                  <button
                    key={chat}
                    type="button"
                    className={`block w-full truncate rounded-lg px-2 py-1.5 text-left text-sm transition ${
                      isActive
                        ? "bg-neutral-900 text-green-400"
                        : "text-neutral-300 hover:bg-neutral-900/60"
                    }`}
                  >
                    {chat}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
      )}

      {/* Main chat column */}
      <div className="flex min-w-0 flex-1 flex-col">
      {/* Header */}
      <header className="flex items-center gap-2 border-b border-neutral-800 px-5 py-3">
        {!sidebarOpen && (
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="text-neutral-500 transition hover:text-neutral-200"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none">
              <path
                d="M8 5l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        <span className="text-[15px] font-semibold text-green-400">
          Quark Chat
        </span>
        <svg
          className="h-4 w-4 text-neutral-500"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden
        >
          <path
            d="M5.5 7.5l4.5 4.5 4.5-4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </header>

      {/* Conversation */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end">
                <div className="max-w-[80%] rounded-3xl border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-[15px] leading-relaxed text-neutral-100">
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={i} className="flex gap-3">
                <div className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full border border-neutral-800">
                  <span className="text-[13px] text-green-400">✳</span>
                </div>
                <p className="max-w-[80%] text-[15px] leading-relaxed text-neutral-200">
                  {m.text}
                </p>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="px-4 pb-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-end gap-2 rounded-3xl border border-neutral-800 bg-neutral-900 px-4 py-3">
            <span className="flex-1 text-[15px] text-neutral-500">
              Ask anything
            </span>
            <button
              type="button"
              className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-green-500 text-black transition hover:bg-green-400"
              aria-label="Send"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 15V5M10 5l-4 4M10 5l4 4"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-neutral-500">
            Quark Chat can make mistakes. Check important info.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
