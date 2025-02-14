import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useScrollToHash = (navbarHeight: number) => {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        // Scroll the element into view with an offset for the navbar height
        window.scrollTo({
          top:
            element.getBoundingClientRect().top + window.scrollY - navbarHeight,
          behavior: "smooth",
        });
      }
    }
  }, [location.hash, navbarHeight]);
};

export default useScrollToHash;
