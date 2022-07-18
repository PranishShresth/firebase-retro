import { useEffect, useRef } from "react";

type Delay = number | null;
type TimerHandler = (...args: any[]) => void;
type UseInterval = (
  callback: () => void,
  delay: number,
  deps?: unknown[]
) => () => void;
/**
 * Provides a declarative useInterval
 *
 * @param callback - Function that will be called every `delay` ms.
 * @param delay - Number representing the delay in ms. Set to `null` to "pause" the interval.
 */

const useInterval: UseInterval = (
  callback: TimerHandler,
  delay: Delay,
  deps = []
) => {
  const savedCallbackRef = useRef<TimerHandler>();
  const refInterval = useRef<number>();

  useEffect(() => {
    savedCallbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (savedCallbackRef.current && delay !== null) {
      const timerId = window.setInterval(savedCallbackRef.current, delay);
      if (refInterval) {
        refInterval.current = timerId;
      }

      return () => window.clearInterval(timerId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, ...deps]);

  function cancelInterval() {
    return window.clearInterval(refInterval.current);
  }

  return cancelInterval;
};

export { useInterval };
