import { useState, useEffect } from "react";

const useShuffle = (store) => {
  const [val, setVal] = useState(JSON.parse(localStorage.getItem(store)) || 1);

  useEffect(() => {
    localStorage.setItem(store, JSON.stringify(val));
  }, [val, store]);

  return [val, setVal];
};
export default useShuffle;
