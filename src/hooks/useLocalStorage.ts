import { useState } from 'react';

type ULSReturn = [
  any,
  (v: any) => void,
  () => void
];

type USL = (k: string, initial: any) => ULSReturn;

const useLocalStorage: USL = (key, initial) => {
  const [value, storeValue] = useState(() => {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : initial;
    } catch (err) {
      console.error(err);
      return initial;
    }
  });

  const setValue = (arg: any) => {
    try {
      const valToStore = arg instanceof Function ? arg(value) : arg;
      storeValue(valToStore);
      localStorage.setItem(key, JSON.stringify(valToStore));
    } catch (err) {
      console.error(err);
    }
  };

  return [value, setValue, () => localStorage.removeItem(key)];
};

export default useLocalStorage;