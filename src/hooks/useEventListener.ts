import { useEffect, useRef } from 'react';

const useEventListener = (event: string, cb: EventListener, opts?: { target: HTMLElement }) => {
  const savedCb = useRef<EventListener>();
  const el = (opts && opts.target) || window;

  useEffect(() => {
    if (savedCb.current && savedCb.current !== cb) {
      el.removeEventListener(event, savedCb.current);
    }

    savedCb.current = cb;
    el.addEventListener(event, savedCb.current);

    return () => {
      if (el && savedCb.current) {
        el.removeEventListener(event, savedCb.current);
      }
    }
  }, [cb]);
};

export default useEventListener;