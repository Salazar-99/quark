import { useCallback, useEffect, useState } from "react";
import TerminalScreen from "./screens/TerminalScreen";
import ChatScreen from "./screens/ChatScreen";

type Screen = "terminal" | "chat";

function App() {
  const [screen, setScreen] = useState<Screen>("terminal");

  const toggle = useCallback(
    () => setScreen((s) => (s === "terminal" ? "chat" : "terminal")),
    [],
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // ⌘+Tab is requested, but macOS reserves it for the system app switcher
      // so it never reaches the webview. Ctrl+Tab is bound as a working shortcut.
      if (e.key === "Tab" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {screen === "terminal" ? <TerminalScreen /> : <ChatScreen />}
    </div>
  );
}

export default App;
