import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const stripe = require("stripe")(process.env.STRIPE_KEY);

export const createStripePaymentIntent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, paymentId, isSubscription } = req.body;
  console.log("Initial userId in createStripePaymentIntent:", userId);

  // Basic validation for required fields
  if (!paymentId || !userId) {
    res.status(400).json({
      error: "paymentId, and userId fields are required.",
    });
    return;
  }

  try {
    if (isSubscription) {
      console.log("userId before passing to handleSubscription:", userId);

      // Handle subscription case
      handleSubscription(paymentId, userId, res);
      return;
    } else {
      // Handle standard payment case
      handleStandardPayment(paymentId, userId, res);
      return;
    }
  } catch (error: any) {
    console.error("Error creating PaymentIntent:", error);
    console.log(error, res);
    return;
  }
};

// Function to handle subscription logic
const handleSubscription = async (
  paymentId: number,
  userId: number,
  res: Response
) => {
  const signature = await prisma.signature.findFirst({
    where: { userId },
    include: {
      gymPlan: { select: { priceStripeId: true, price: true } },
      user: { select: { userId: true, customerStripeId: true, email: true } },
    },
  });
  console.log(signature);

  if (!signature) {
    return res.status(404).json({ error: "Signature not found." });
  }
  const payment = await prisma.payment.findUnique({
    where: { paymentId: paymentId },
    select: {
      amount: true,
    },
  });
  if (!payment) {
    return res.status(404).json({ error: "Payment n encontrado" });
  }
  const priceFormatted = payment.amount * 100;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: priceFormatted,
    currency: "eur",
    automatic_payment_methods: { enabled: true },
    customer: signature.user.customerStripeId,
    receipt_email: signature.user.email,
    metadata: { paymentId: paymentId.toString(), isSubscription: true },
  });

  return res.status(200).json({ clientSecret: paymentIntent.client_secret });
};

// Function to handle standard payment logic
const handleStandardPayment = async (
  paymentId: string,
  userId: number,
  res: Response
) => {
  // Fetch payment details from the database
  const payment = await prisma.payment.findUnique({
    where: { paymentId: parseInt(paymentId, 10) },
    select: {
      amount: true,
      paymentStatus: { select: { paymentStatusId: true } },
      signature: {
        select: {
          user: {
            select: { userId: true, customerStripeId: true, email: true },
          },
          gymPlan: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  if (!payment) {
    return res.status(404).json({ error: "Payment not found." });
  }

  // Check payment status and user ID
  if (payment.paymentStatus.paymentStatusId === 2) {
    return res
      .status(401)
      .json({ error: "This payment is already completed." });
  }

  if (payment.signature.user.userId !== userId) {
    return res.status(401).json({ error: "Access restricted." });
  }

  const priceFormatted = Math.round(payment.amount * 100); // Convert amount to cents

  // Create PaymentIntent for the standard payment
  const paymentIntent = await stripe.paymentIntents.create({
    amount: priceFormatted,
    currency: "eur",
    automatic_payment_methods: { enabled: true },
    customer: payment.signature.user.customerStripeId,
    receipt_email: payment.signature.user.email,
    metadata: { paymentId: paymentId.toString() },
    description: `Pagamento referente ao plano ${payment.signature.gymPlan.name}`,
  });

  return res.status(200).json({ clientSecret: paymentIntent.client_secret });
};

export const verifyPaymentStripe = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.body;

  // Check if userId is provided
  if (!userId) {
    res.status(400).json({ error: "Invalid userId parameter" });
    return;
  }

  const paymentIntent = Array.isArray(req.query.payment_intent)
    ? req.query.payment_intent[0]
    : req.query.payment_intent;

  if (typeof paymentIntent !== "string") {
    res.status(400).json({ error: "Invalid payment_intent parameter" });
    return;
  }

  try {
    // Fetch payment intent object from Stripe
    const paymentIntentObject = await stripe.paymentIntents.retrieve(
      paymentIntent
    );

    if (!paymentIntentObject) {
      res.status(400).json({ error: "Invalid paymentIntentObject" });
      return;
    }

    const paymentIdFromIntentObject = paymentIntentObject.metadata.paymentId;

    // Fetch the payment from the database
    const payment = await prisma.payment.findFirst({
      where: {
        OR: [
          { paymentStripeId: paymentIntent },
          { paymentId: Number(paymentIdFromIntentObject) },
        ],
      },
      select: {
        paymentId: true,
        amount: true,
        date: true,
        paymentStatus: {
          select: {
            paymentStatusName: true,
          },
        },
        signature: {
          select: {
            user: {
              select: {
                userId: true,
                customerStripeId: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      res.status(404).json({ error: "Payment not found" });
      return;
    }

    // Check if the userId matches the payment
    if (userId !== payment?.signature.user.userId) {
      res.status(404).json({
        error:
          "Por favor verifique se está com a sessão iniciada na conta correta.",
      });
      return;
    }

    // Return payment details from DB or Stripe
    const paymentDate = payment.date || paymentIntentObject.created;
    const paymentStatus = paymentIntentObject.status;
    const paymentAmount =
      payment.amount || paymentIntentObject.amount_received / 100;
    const paymentUserEmail = payment.signature.user.email;
    const paymentIdFromDb = payment.paymentId || paymentIntentObject.id;
    const paymentDescription = paymentIntentObject.description;

    res.json({
      paymentDate,
      paymentStatus,
      paymentAmount,
      paymentUserEmail,
      paymentIdFromDb,
      paymentDescription,
    });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ error: "Erro desconhecido" });
  }
};
