import useMediaQuery from "@/hooks/useMediaQuery";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { useUserRegistrationMutation } from "@/state/api";
import { setSelectedGymPlan, setUser } from "@/state";
import { isApiErrorResponse } from "@/helpers/isApiErrorResponse";
import { setCredetials } from "@/state/authSlice";
import { useNavigate } from "react-router-dom";

type Props = {
  onBack: () => void; // Function to handle going back
  onBackWithError: (message: string) => void;
};

const PaymentInfo = ({ onBack, onBackWithError }: Props) => {
  const dispatch = useAppDispatch(); // Get the dispatch function
  const navigate = useNavigate();
  const selectedPlan = useAppSelector((state) => state.global.selectedGymPlan);

  const user = useAppSelector((state) => state.global.user);
  const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");

  const [accepted, setAccepted] = useState<boolean>(false);

  const [userRegistration, { isLoading }] = useUserRegistrationMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Log all relevant information upon submission
    console.log("ALL USER INFO", user);
    console.log("SELECTED PLAN", selectedPlan);

    if (user) {
      // Destructure to omit countryNif from the user object
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { countryNif, ...userWithoutCountryNif } = user;

      // Check if gymPlanId is provided and pass error message if not
      if (selectedPlan?.gymPlanId === undefined) {
        const errorMsg = "Por favor, selecione um plano válido.";
        onBackWithError(errorMsg); // Pass error message to the error handling function
        return; // Exit the function
      }

      // Create the userData object without countryNif
      const userData = {
        ...userWithoutCountryNif, // Spread the rest of the user properties without countryNif
        gymPlanId: selectedPlan.gymPlanId, // Add the gymPlanId
        registrationFee: 0, // TODO: MAKE THIS DYNAMIC
      };

      try {
        // Proceed with the API call
        const result = await userRegistration(userData).unwrap();
        console.log("Registration successful:", result);

        // Dispatch the actions
        dispatch(setSelectedGymPlan(null));
        dispatch(setUser(null));

        dispatch(
          setCredetials({ accessToken: result.accessToken, user: result.user })
        );
        const amountToPay = result.amountToPay;
        const paymentId = result.paymentId;
        const isSubscription = true;
        setTimeout(() => {
          if (result.paymentToken) {
            navigate(`/checkout/`, {
              state: { amountToPay, paymentId, isSubscription },
            });
          } else {
            console.error("Payment token is missing in the result:", result);
          }
        }, 1);
        // After dispatching, user state will update in the next render cycle
        console.log("Dispatched actions to clear selected plan and user");
      } catch (error: unknown) {
        if (isApiErrorResponse(error)) {
          const errorMsg = `Infelizmente, ocorreu um erro no registo: ${error.data?.message || "Erro desconhecido, pedimos imensa desculpa!"}`;
          onBackWithError(errorMsg); // Pass errorMsg directly
        } else {
          const errorMsg =
            "Ocorreu um erro inesperado no registo. Pedimos imensa desculpa!";
          onBackWithError(errorMsg); // Pass errorMsg directly
          console.log("setting on payment", errorMsg); // Log the same errorMsg
        }
      }
    } else {
      console.error("User data is null.");
    }
  };

  const handleChange = () => {
    setAccepted(!accepted); // Toggle the state when clicked
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`p-8 bg-background-alt-light dark:bg-background-alt rounded-lg shadow-lg ${
          isAboveMediumScreens ? "w-1/2" : "max-w-xl"
        }`}
      >
        <button
          onClick={onBack}
          className="text-black hover:underline dark:text-white"
        >
          &larr; Voltar
        </button>

        <h1 className="text-center text-3xl font-bold mb-6">
          Resumo do Contrato
        </h1>

        {/* Display Selected Plan Information */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-background-color dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Plano Escolhido</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Nome do Plano:</span>
                <span className="font-semibold">{selectedPlan?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Mensalidade:</span>
                <span className="font-semibold">{selectedPlan?.price}€</span>
              </div>
              <div className="flex justify-between">
                <span>Data de Início:</span>
                <span className="font-semibold">
                  {new Date().toLocaleString("pt-PT", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Válido por:</span>
                <span className="font-semibold">30 dias</span>
              </div>
              <div className="flex justify-between">
                <span>Joia:</span>
                <span className="font-semibold">€</span>
              </div>
            </div>

            <hr className="my-4" />

            <h2 className="text-xl font-semibold mb-4">
              Detalhes do Pagamento
            </h2>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>
                  Primeiro Pagamento:{" "}
                  <span className="font-semibold">{selectedPlan?.price}€</span>
                </span>
                <span className="font-semibold">
                  {new Date().toLocaleString("pt-PT", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>
                  Próximo Pagamento:{" "}
                  <span className="font-semibold">{selectedPlan?.price}€</span>
                </span>
                <span className="font-semibold">
                  {new Date(
                    new Date().setMonth(new Date().getMonth() + 1)
                  ).toLocaleString("pt-PT", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center mt-4">
              <input
                type="radio"
                id="accept-conditions"
                name="conditions"
                checked={accepted}
                onChange={handleChange}
                className="h-4 w-4 text-secondary-400 border-gray-300 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600"
                required // Make it a required field
              />
              <label
                htmlFor="accept-conditions"
                className="ml-2 text-sm text-gray-700 dark:text-gray-300"
              >
                Declaro que li na íntegra, compreendo e aceito sem reservas as
                condições do <strong>Sonder Hub</strong>.
              </label>
            </div>
          </div>

          <h1 className="text-center text-3xl font-bold mb-6">Pagamento</h1>

          {/* Payment Method Selection */}
          <p className="text-sm text-center text-gray-600 dark:text-gray-300">
            Será redirecionado para fazer o pagamento inicial na próxima página.
          </p>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg shadow transition duration-200 ease-in-out dark:text-partial-black ${
              isLoading
                ? "bg-secondary-200 cursor-not-allowed"
                : "bg-secondary-400 hover:bg-secondary-200"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="font-bold">A Carregar...</span> // Display loading message
            ) : (
              <span className="font-bold">Seguinte</span> // Display normal button text
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentInfo;
