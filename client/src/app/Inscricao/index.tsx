import { useAppSelector } from "@/app/redux";
import PlanosGinasio from "./planosDisponiveis";
import UserRegistrationForm from "./UserRegistrationForm";
import Questions from "./Questions";
import PaymentInfo from "./PaymentInfo";
import { useState, useEffect } from "react";

const Inscricao = () => {
  const selectedPlan = useAppSelector((state) => state.global.selectedGymPlan);
  console.log(selectedPlan);
  const user = useAppSelector((state) => state.global.user);
  console.log(user);

  // State to manage question visibility
  const [showQuestions, setShowQuestions] = useState(false);
  // State to manage payment info visibility
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  // Function to handle showing questions
  const handleShowQuestions = () => {
    setShowQuestions(true);
  };

  // Function to handle going back to the registration form
  const handleBackToForm = () => {
    setShowQuestions(false);
    setShowPaymentInfo(false); // Reset payment info visibility
  };
  const handleBackToFormWithErrorMessage = (errorMessage: string) => {
    setShowQuestions(false);
    setShowPaymentInfo(false);

    if (typeof errorMessage === "string") {
      setErrorMessage(errorMessage); // Set the error message only if it's a valid string
    } else {
      console.error("Error message is not a valid string:", errorMessage);
    }

    console.log("Set error message in Inscricao:", errorMessage);
  };

  // Function to handle showing payment info
  const handleShowPaymentInfo = () => {
    setShowPaymentInfo(true);
    setShowQuestions(false); // Hide questions when showing payment info
  };
  // Scroll to top whenever a state that affects content changes
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, [showQuestions, showPaymentInfo, selectedPlan]);

  return (
    <section
      id="inscricao"
      className="bg-background-color-light dark:bg-background-color py-28 text-black dark:text-white"
    >
      {/* Conditional Rendering Logic */}
      {showPaymentInfo ? (
        <PaymentInfo
          onBack={handleBackToForm}
          onBackWithError={handleBackToFormWithErrorMessage}
        />
      ) : showQuestions && user ? (
        <Questions onBack={handleBackToForm} onSubmit={handleShowPaymentInfo} /> // Pass onSubmit to Questions
      ) : selectedPlan ? (
        <UserRegistrationForm
          onQuestions={handleShowQuestions}
          errorMessageOnSubmition={errorMessage}
        />
      ) : (
        <PlanosGinasio /> // Show PlanosGinasio if no user and no selectedPlan
      )}
    </section>
  );
};

export default Inscricao;
