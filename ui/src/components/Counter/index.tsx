import { formatDoubleDigits } from "@/lib/display";
import { useEffect, useState } from "react"

export default function Counter({ endTime }: {
  endTime: number
}) {
  console.log(endTime, Date.now());
  const [remainingTime, setRemainingTime] = useState<number>(Math.max(endTime*1000 - Date.now(), 0));

  const hours = Math.floor(remainingTime / (60 * 60 * 1000)) % 60;
  const minutes = Math.floor(remainingTime / (60 * 1000)) % 60;
  const seconds = Math.floor(remainingTime / (1000)) % 60;

  useEffect(() => {
    const timer = setInterval(() => {
      if ( remainingTime === 0 ) clearInterval(timer);
      setRemainingTime(Math.max(endTime*1000 - Date.now(), 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>{formatDoubleDigits(hours)}:{formatDoubleDigits(minutes)}:{formatDoubleDigits(seconds)}</>
  )
}