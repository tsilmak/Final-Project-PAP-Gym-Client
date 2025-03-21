import { useNavigate } from "react-router-dom";

interface PrimaryButtonProps {
  label: string;
  navigateTo: string | null;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ label, navigateTo }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Only navigate if navigateTo is not null or empty
    if (navigateTo) {
      navigate(`/${navigateTo}`);
    }
  };

  return (
    <button
      className="rounded-md text-partial-black bg-secondary-400 px-10 py-2 hover:bg-secondary-500"
      onClick={handleClick}
    >
      {label}
    </button>
  );
};

export default PrimaryButton;
