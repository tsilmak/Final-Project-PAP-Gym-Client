import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Handles the "payment_intent.succeeded" event from Stripe.
 * @param paymentIntentId - The ID of the Stripe PaymentIntent.
 * @returns A promise that resolves when the payment status is updated.
 */

const stripe = require("stripe")(process.env.STRIPE_KEY);

export async function handlePaymentIntentSucceeded(
  paymentId: string,
  paymentStripeId: string,
  isSubscription: boolean
): Promise<void> {
  try {
    // Fetch the payment record from the database

    const payment = await prisma.payment.findUnique({
      where: {
        paymentId: parseInt(paymentId),
      },
      select: {
        paymentStatusId: true,
        paymentStripeId: true,
        signatureId: true,
      },
    });

    if (!payment) {
      throw new Error(
        `Payment with PaymentIntent ID "${paymentId}" not found.`
      );
    }
    const signatureId = payment.signatureId;

    // Update the payment status to 'PAID'
    await prisma.payment.update({
      where: {
        paymentId: parseInt(paymentId), // Use the unique identifier
      },
      data: {
        paymentStatusId: 2, // 2 PAGO
        paymentStripeId: paymentStripeId, // Update the Stripe ID
      },
    });
    if (!signatureId) {
      throw new Error(
        `signatureId with signatureId ID "${signatureId}" not found.`
      );
    }
    // Coloca a assinatura como ativa
    await prisma.signature.update({
      where: { signatureId },
      data: {
        isActive: true,
      },
    });
    console.log("issubscriprion", isSubscription);
    if (isSubscription) {
      try {
        const signature = await prisma.signature.findUnique({
          where: {
            signatureId: signatureId,
          },
          select: {
            gymPlan: {
              select: {
                priceStripeId: true,
              },
            },
            user: {
              select: {
                customerStripeId: true,
              },
            },
          },
        });
        if (!signature)
          throw new Error(`Esta assinatura não existe ID "${signatureId}".`);

        // !ERRO
        // StripeInvalidRequestError:
        // This customer has no attached payment source or default payment method. Please consider adding a default payment method. For more information, visit https://stripe.com/docs/billing/subscriptions/payment-methods-setting#payment-method-priority.

        const subscriptionStripe = await stripe.subscriptions.create({
          customer: signature.user.customerStripeId,
          items: [{ price: signature.gymPlan.priceStripeId }],
          payment_behavior: "allow_incomplete", // The subscription will be activated immediately
          collection_method: "charge_automatically", // Payment will be charged automatically when possible
        });
        console.log(subscriptionStripe);
      } catch (error) {
        console.log("ERRO NA ASSINATRA", error);
      }
    }

    console.log(`Payment with ID ${paymentId} updated to PAID.`);
  } catch (error) {
    console.error(
      `Error updating payment status for PaymentIntent ID "${paymentId}":`,
      error
    );
    throw error; // Re-throw the error for further handling if needed
  }
}

export async function handlePaymentIntentFailed(
  paymentId: string,
  paymentStripeId: string
): Promise<void> {
  try {
    console.log(paymentId);
    console.log(paymentStripeId);
    // Fetch the payment record from the database

    const payment = await prisma.payment.findUnique({
      where: {
        paymentId: parseInt(paymentId),
      },
      select: {
        paymentStatusId: true,
        paymentStripeId: true,
        signatureId: true,
      },
    });

    if (!payment) {
      throw new Error(
        `Payment with PaymentIntent ID "${paymentId}" not found.`
      );
    }
    const signatureId = payment.signatureId;

    // Update the payment status to 'PAID'
    await prisma.payment.update({
      where: {
        paymentId: parseInt(paymentId), // Use the unique identifier
      },
      data: {
        paymentStatusId: 1, // 2 PENDENTE
        paymentStripeId: paymentStripeId, // Update the Stripe ID
      },
    });
    if (!signatureId) {
      throw new Error(
        `signatureId with signatureId ID "${signatureId}" not found.`
      );
    }
    // Coloca a assinatura como ativa
    await prisma.signature.update({
      where: { signatureId },
      data: {
        isActive: false,
      },
    });

    console.log(`Payment with ID ${paymentId} updated to PENDENTE.`);
  } catch (error) {
    console.error(
      `Error updating payment status for PaymentIntent ID "${paymentId}":`,
      error
    );
    throw error; // Re-throw the error for further handling if needed
  }
}
