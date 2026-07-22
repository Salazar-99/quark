import { useEffect, useRef, useState } from "react";

// An interactive "Quark Code" terminal. The prompt is pinned to the bottom;
// entered lines bubble up into the history area above, Claude Code style.
export default function TerminalScreen() {
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Keep the hidden input focused so keystrokes are always captured.
  const focusInput = () => inputRef.current?.focus({ preventScroll: true });
  useEffect(focusInput, []);

  // Scroll the newest line into view as history grows.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [history]);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      setHistory((h) => [...h, input]);
      setInput("");
    }
  }

  return (
    <div
      onClick={focusInput}
      className="flex h-full w-full cursor-text flex-col bg-[#0a0a0a] font-mono text-[13px] leading-relaxed text-neutral-300"
    >
      {/* History: entered lines bubble up from the bottom */}
      <div className="flex flex-1 flex-col justify-end overflow-auto px-5 py-4">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-words">
            <span className="text-green-400">{"> "}</span>
            <span className="text-neutral-200">{line}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Prompt pinned to the bottom, with a divider line above it */}
      <div className="border-t border-neutral-800 px-5 py-3">
        <div className="whitespace-pre-wrap break-words">
          <span className="text-green-400">{"> "}</span>
          <span className="text-neutral-200">{input}</span>
          <span className="ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.15em] bg-green-400 animate-[blink_1s_step-end_infinite]" />
        </div>

        {/* Hidden input that actually captures typing */}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          className="h-0 w-0 opacity-0"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          aria-label="Terminal input"
        />
      </div>
    </div>
  );
}
