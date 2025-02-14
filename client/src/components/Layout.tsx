import Navbar from "@/components/Navbar";
import ContactForm from "@/components/ContactForm";
import Footer from "./Footer";
import { useEffect, useState, ReactNode } from "react";
import { useAppSelector } from "@/app/redux"; // Adjust your import for useAppDispatch

interface LayoutProps {
  children: ReactNode;
  showContactForm?: boolean;
}

const Layout = ({ children, showContactForm = true }: LayoutProps) => {
  const [isNavbarTop, setIsNavbarTop] = useState<boolean>(true);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Effect for setting dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Effect to monitor the scroll position for the Navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsNavbarTop(true);
      } else {
        setIsNavbarTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar isNavbarTop={isNavbarTop} />
      {children}
      {showContactForm && <ContactForm />}
      <Footer />
    </>
  );
};

export default Layout;
