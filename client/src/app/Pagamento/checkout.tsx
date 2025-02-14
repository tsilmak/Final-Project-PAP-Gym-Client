import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CheckoutForm from ".";
import { StripeWrapper } from "../context/StripeContext";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { amountToPay, paymentId, isSubscription } = location.state || {};

  useEffect(() => {
    if (!amountToPay || !paymentId || isSubscription === undefined) {
      navigate("/"); // Redirect if payment info is missing
    }
  }, [amountToPay, paymentId, isSubscription, navigate]);

  if (!amountToPay || !paymentId || isSubscription === undefined) {
    return null; // Render nothing while navigating
  }

  return (
    <StripeWrapper
      paymentId={paymentId}
      amountToPay={amountToPay}
      isSubscription={isSubscription}
    >
      <CheckoutForm amountToPay={amountToPay} />
    </StripeWrapper>
  );
}
