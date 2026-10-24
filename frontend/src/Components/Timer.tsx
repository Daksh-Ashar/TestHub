import { useEffect, useState } from "react";

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
}

export default function Timer({ duration, onTimeUp }: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(duration);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  // Build dynamic display
  let display = "";
  if (minutes > 0) {
    display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} Min`;
  } else {
    display = `${String(seconds).padStart(2, "0")} Sec`;
  }

  return (
    <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
      ⏱ {display}
    </div>
  );
}