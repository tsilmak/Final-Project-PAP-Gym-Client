import { LoadingSpinner } from "@/components/LoadingSpinner";
import useMediaQuery from "@/hooks/useMediaQuery";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
interface CheckoutFormProps {
  amountToPay: number;
}
export default function CheckoutForm({ amountToPay }: CheckoutFormProps) {
  const stripe = useStripe(); // Stripe instance
  const elements = useElements(); // Stripe elements ( PaymentElement)

  const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");

  const [isLoadingPayment, setIsLoadingPayment] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Early exit if stripe or elements are not loaded
    if (!stripe || !elements) {
      return;
    }

    try {
      setIsLoadingPayment(true);

      // Submit payment details using PaymentElement
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${import.meta.env.VITE_URL}/complete/`,
        },
      });

      if (submitError) {
        setErrorMessage(submitError.message || "An error occurred.");
        setIsLoadingPayment(false);
        return;
      }

      // Navigate to user profile page after successful registration and payment
      console.log("User registration and payment completed successfully.");
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
      console.log(error); // Handle any unexpected errors
    } finally {
      setIsLoadingPayment(false);
    }
  };

  return (
    <div className="bg-background-alt-light dark:bg-background-color flex flex-col items-center justify-center px-4 py-56">
      <div
        className={`bg-background-alt-light dark:bg-background-alt p-8 rounded-lg shadow-md w-full max-w-2xl mb-16 ${
          isAboveMediumScreens ? "w-1/2" : "max-w-xl"
        }`}
      >
        {elements && stripe && (
          <h2 className="text-2xl font-semibold text-primary mb-6 dark:text-white">
            Detalhes do Pagamento
          </h2>
        )}

        <div className="flex justify-between">
          <span className="text-lg dark:text-white">Valor a pagar:</span>
          <span className="font-semibold text-lg dark:text-white">
            {amountToPay}€
          </span>
        </div>
        <hr className="my-4 border-t-2 border-secondary-300" />
      </div>

      <div className="w-full max-w-2xl p-6 bg-background-alt-light dark:bg-background-alt rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6 min-h-[400px]">
          <PaymentElement />
          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-semibold transition duration-200 ease-in-out transform ${
              isLoadingPayment
                ? "bg-secondary-200 cursor-not-allowed"
                : "bg-secondary-400 hover:bg-secondary-300"
            }`}
            disabled={isLoadingPayment}
          >
            {isLoadingPayment ? (
              <span className="flex justify-center text-lg text-partial-black">
                A Processar...{" "}
                <span className="ml-2">
                  <LoadingSpinner />
                </span>
              </span>
            ) : (
              <span className="text-lg text-partial-black">
                Pagar {amountToPay}€
              </span>
            )}
          </button>
          {errorMessage && (
            <p className="text-red-500 text-sm">Dica: {errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}
