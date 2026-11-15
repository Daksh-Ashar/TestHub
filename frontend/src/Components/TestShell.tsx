import { useCallback, useEffect, useRef, useState } from "react";

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
  const violations = useRef(0);
  const [violationCount, setViolationCount] = useState(0);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(
    () => !document.fullscreenElement,
  );

  // ================= FULLSCREEN ENTER =================
  const enterFullScreen = async () => {
    const elem = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void> | void;
    };

    try {
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      }
      setShowFullscreenPrompt(false); // hide prompt once fullscreen
    } catch (err) {
      console.error("Fullscreen error:", err);
      setShowFullscreenPrompt(true); // still show prompt if fails
    }
  };

  // ================= VIOLATION HANDLER =================
  const handleViolation = useCallback(() => {
    if (violations.current >= maxViolations) return;

    const next = ++violations.current;
    setViolationCount(next);

    if (next === maxViolations) onForceSubmit();
  }, [maxViolations, onForceSubmit]);

  // ================= FULLSCREEN CHANGE =================
  const handleFullscreenChange = useCallback(() => {
    const fs = !!document.fullscreenElement;

    if (!fs) {
      // exited fullscreen → show warning/prompt
      setShowFullscreenPrompt(true);
      handleViolation();
    } else {
      setShowFullscreenPrompt(false);
    }
  }, [handleViolation]);

  // ================= TAB SWITCH =================
  const handleVisibility = useCallback(() => {
    if (document.hidden) {
      handleViolation();
    }
  }, [handleViolation]);

  // ================= INIT =================
  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [handleFullscreenChange, handleVisibility]);

  return (
    <div>
      {/* ================= FULLSCREEN PROMPT ================= */}
      {showFullscreenPrompt && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border-2 border-[#1767AD] bg-white p-8 text-center shadow-2xl">
            <p className="text-lg font-medium text-slate-800">
              ⚠ Please enter fullscreen to continue the test
            </p>
            <button
              onClick={enterFullScreen}
              className="mt-5 rounded-md bg-gradient-to-r from-[#073A7C] via-[#1767AD] to-[#255B8E] px-5 py-2.5 font-medium text-white hover:brightness-110"
            >
              Enter Fullscreen
            </button>
            <p className="mt-5 text-center font-semibold text-black">
              Violations: {violationCount}/{maxViolations}
            </p>
          </div>
        </div>
      )}

      {/* ================= TEST CONTENT ================= */}
      {children}
    </div>
  );
}
