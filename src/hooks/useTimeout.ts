import { useRef, useEffect } from 'react';

type UseTimeout = (callback: Function, delay: number, deps?: Array<any>) => void
const useTimeout: UseTimeout = (callback, delay, deps = []) => {
  const savedCallback = useRef<Function>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function func() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    const id = setTimeout(func, delay);
    return () => clearTimeout(id);
  }, [delay, ...deps]);
}

export default useTimeout;