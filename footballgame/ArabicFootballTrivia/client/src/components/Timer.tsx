import { useEffect, useState } from "react";

interface TimerProps {
  timeRemaining: number;
}

export default function Timer({ timeRemaining }: TimerProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (timeRemaining <= 10) {
      setAnimate(true);
    } else {
      setAnimate(false);
    }
  }, [timeRemaining]);

  const getTimerColor = () => {
    if (timeRemaining <= 5) return "bg-red-500";
    if (timeRemaining <= 10) return "bg-[#FF4500]";
    return "bg-[#FF4500]";
  };

  return (
    <div className="relative">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${getTimerColor()} ${
        animate ? 'animate-pulse' : ''
      }`}>
        <span className="text-3xl font-bold text-white">{timeRemaining}</span>
      </div>
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
        <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded text-white">
          ثانية
        </span>
      </div>
    </div>
  );
}
