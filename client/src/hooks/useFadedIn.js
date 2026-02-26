import { useEffect, useRef, useState } from "react";

export const useFadedIn = () => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();
  const isRan = useRef(false);

  useEffect(() => {
    try {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (isVisible && isRan.current) {
            return;
          }

          if (entry.isIntersecting) {
            isRan.current = true;
            setVisible(entry.isIntersecting);
          }
        });
      });

      observer.observe(domRef.current);
    } catch {}
  }, []);

  useEffect(() => {
    if (domRef.current) {
      domRef.current.classList.add("fade-in-section");
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      domRef.current.classList.add("is-visible");
    }
  }, [isVisible]);

  return { domRef };
};
