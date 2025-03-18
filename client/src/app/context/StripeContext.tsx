import { useGetClientSecretMutation } from "@/state/api";
import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { Appearance, loadStripe } from "@stripe/stripe-js";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface StripeWrapperProps {
  paymentId: number;
  amountToPay: number;
  isSubscription: boolean;
  children: React.ReactNode;
}

const stripePromise = loadStripe(
  "pk_test_51QM5tFCRniDWvC9XNtYIp9z5ClUmMURYR5EhbOyRUEZAAPfOmDae60oGmirsh7bHjWbYTJVcrRwppHppRApz4hj500MNKwQgDQ"
);

const appearance: Appearance = {
  theme: "night",
  variables: {
    fontFamily: "Sohne, system-ui, sans-serif",
    fontWeightNormal: "500",
    borderRadius: "8px",
    colorBackground: "#0A2540",
    colorPrimary: "#EFC078",
    accessibleColorOnColorPrimary: "#1A1B25",
    colorText: "white",
    colorTextSecondary: "white",
    colorTextPlaceholder: "#ABB2BF",
    tabIconColor: "white",
    logoColor: "dark",
  },
  rules: {
    ".Input": {
      backgroundColor: "#212D63",
      border: "1px solid var(--colorPrimary)",
    },
  },
};

export const StripeWrapper = ({
  paymentId,
  amountToPay,
  isSubscription,
  children,
}: StripeWrapperProps) => {
  const [getClientSecret] = useGetClientSecretMutation();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const initializePayment = async () => {
      try {
        const result = await getClientSecret({
          paymentId,
          amountToPay,
          isSubscription,
        }).unwrap();
        if (result?.clientSecret) {
          setClientSecret(result.clientSecret);
        } else {
          setErrorMessage("Client secret is missing in the response.");
        }
      } catch (error) {
        setErrorMessage("An error occurred while processing the payment.");
        console.error("Failed to get client secret:", error);
      }
    };
    initializePayment();
  }, [getClientSecret, paymentId, amountToPay, isSubscription]);

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  if (!clientSecret) {
    return (
      <section className="h-full flex justify-center items-center text-partial-black dark:text-white dark:bg-background-color">
        <LoadingSpinner />
      </section>
    );
  }

  return (
    <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
      {children}
    </Elements>
  );
};
