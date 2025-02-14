import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express"; // Import types for better TypeScript support.

const prisma = new PrismaClient();

// Function to retrieve payments for a user based on their signatures.
export const getAllPaymentsFromUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.body; // Destructure the userId from the request body.

  try {
    // Query payments by navigating through the Signature model.
    const payments = await prisma.payment.findMany({
      where: {
        signature: {
          userId: userId, // Match the userId in the Signature model.
        },
      },
      select: {
        paymentId: true,
        date: true,
        amount: true,
        paymentStripeId: true,
        title: true,
        paymentStatus: {
          select: {
            paymentStatusName: true, // Select only the name from the related PaymentStatus model.
          },
        },
      },
    });

    //update date to yyyy-mm-dd
    const formattedPayments = payments.map((payment) => {
      const formattedDate = payment.date.toISOString().split("T")[0]; // Convert date to yyyy-mm-dd format
      return {
        date: formattedDate,
        amount: payment.amount,
        paymentId: payment.paymentId,
        paymentStatusName: payment.paymentStatus.paymentStatusName,
        title: payment.title,
      };
    });

    // Return the payments as a JSON response.
    res.json(formattedPayments);
  } catch (error: any) {
    // Log the error and return a 500 response.
    console.error("Error fetching payments for user:", error);
    res.status(500).json({
      message: "An error occurred while retrieving payments for the user.",
    });
  }
};
