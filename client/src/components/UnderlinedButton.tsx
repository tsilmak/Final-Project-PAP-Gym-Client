import { Link } from "react-router-dom";

type Props = {
  children: string;
  path: string;
  className?: string;
  isSection: boolean;
};

const UnderlinedButton = ({ children, path, className, isSection }: Props) => {
  const handleLinkClick = () => {
    if (isSection) {
      setTimeout(() => {
        const targetElement = document.getElementById(path.split("#")[1]);
        if (targetElement) {
          const navbarHeight = 60;
          const targetPosition =
            targetElement.getBoundingClientRect().top +
            window.scrollY -
            navbarHeight;
          window.scrollTo({ top: targetPosition, behavior: "smooth" });
        }
      }, 100);
    } else {
      setTimeout(() => {
        window.scrollTo(0, 0);
      });
    }
  };
  return (
    <Link to={path} onClick={handleLinkClick}>
      <button
        className={`${className} mx-8 text-2xl font-bold underline hover:text-secondary-500 dark:hover:text-secondary-200`}
      >
        {children}
      </button>
    </Link>
  );
};

export default UnderlinedButton;
