import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
  onForceSubmit: () => void;
  maxViolations?: number;
}

export default function TestShell({
  children,
  onForceSubmit,
  maxViolations = 3,
}: Props) {
  const [violations, setViolations] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);

  // ================= FULLSCREEN ENTER =================
  const enterFullScreen = async () => {
    const elem = document.documentElement;

    try {
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        await (elem as any).webkitRequestFullscreen();
      }
      setIsFullscreen(true);
      setShowFullscreenPrompt(false); // hide prompt once fullscreen
    } catch (err) {
      console.error("Fullscreen error:", err);
      setShowFullscreenPrompt(true); // still show prompt if fails
    }
  };

  // ================= VIOLATION HANDLER =================
  const handleViolation = (reason: string) => {
    setViolations((prev) => {
      const next = prev + 1;
      alert(`Warning: ${reason} (${next}/${maxViolations})`);

      if (next >= maxViolations) {
        alert("Maximum violations reached. Submitting test.");
        onForceSubmit();
      }

      return next;
    });
  };

  // ================= FULLSCREEN CHANGE =================
  const handleFullscreenChange = () => {
    const fs = !!document.fullscreenElement;
    setIsFullscreen(fs);

    if (!fs) {
      // exited fullscreen → show warning/prompt
      setShowFullscreenPrompt(true);
      handleViolation("Exited fullscreen");
    } else {
      setShowFullscreenPrompt(false);
    }
  };

  // ================= TAB SWITCH =================
  const handleVisibility = () => {
    if (document.hidden) {
      handleViolation("Tab switch detected");
    }
  };

  // ================= INIT =================
  useEffect(() => {
    // check if already in fullscreen
    const fs = !!document.fullscreenElement;
    setIsFullscreen(fs);
    if (!fs) setShowFullscreenPrompt(true);

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div>
      {/* ================= FULLSCREEN PROMPT ================= */}
      {showFullscreenPrompt && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#000a",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <p style={{ color: "#fff", fontSize: "1.2rem", textAlign: "center" }}>
            ⚠ Please enter fullscreen to continue the test
          </p>
          <button
            onClick={enterFullScreen}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Enter Fullscreen
          </button>
        </div>
      )}

      {/* ================= STATUS BAR ================= */}
      <div
        style={{
          padding: "10px",
          background: "#111",
          color: "#fff",
        }}
      >
        Violations: {violations}/{maxViolations} |{" "}
        {isFullscreen ? "Fullscreen Active" : "Fullscreen Exited"}
      </div>

      {/* ================= TEST CONTENT ================= */}
      {children}
    </div>
  );
}