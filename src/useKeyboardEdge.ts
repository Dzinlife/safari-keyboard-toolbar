import { useEffect, useState } from "react";

export const useKeyboardEdge = () => {
  const [bottom, setBottom] = useState(0);

  useEffect(() => {
    if (!window.visualViewport) return;

    const handler = () => {
      setBottom(window.innerHeight - window.visualViewport!.height);
    };

    const timer = setInterval(() => {
      window.visualViewport?.addEventListener("resize", handler);
    }, 16);

    return () => {
      window.visualViewport?.removeEventListener("resize", handler);
      clearInterval(timer);
    };
  }, []);

  return { keyboardEdgeBottom: bottom };
};
