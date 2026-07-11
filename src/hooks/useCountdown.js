import { useCallback, useState } from 'react';

/**
 * Drives a simple N-second countdown, exposing the current display value
 * ("3", "2", "1", "📸" then null) and a `start()` function that resolves
 * once the countdown finishes.
 */
export function useCountdown(seconds = 3) {
  const [countdown, setCountdown] = useState(null);

  const start = useCallback(() => {
    return new Promise((resolve) => {
      let remaining = seconds;
      setCountdown(remaining);

      const tick = setInterval(() => {
        remaining -= 1;

        if (remaining <= 0) {
          clearInterval(tick);
          setCountdown('📸');
          setTimeout(() => {
            setCountdown(null);
            resolve();
          }, 220);
        } else {
          setCountdown(remaining);
        }
      }, 1000);
    });
  }, [seconds]);

  return { countdown, start };
}
