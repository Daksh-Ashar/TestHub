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
    <div className="mx-auto flex w-full max-w-sm items-center justify-center rounded-md bg-gradient-to-r from-[#073A7C] via-[#1767AD] to-[#255B8E] px-6 py-3 text-2xl font-bold text-white">
      ⏱ {display}
    </div>
  );
}