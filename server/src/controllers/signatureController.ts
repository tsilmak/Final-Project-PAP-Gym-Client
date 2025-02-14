import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class SignatureController {
  async setSignatureGymPlan(req: Request, res: Response): Promise<void> {
    const { userId, gymPlanId } = req.body;
    console.log("gymPlanId", gymPlanId);
    //check if user has pending payments

    if (!userId || !gymPlanId) {
      res.status(404).json({ message: "User gymPlanId not found" });

      return;
    }
    try {
      // Step 1: Retrieve the user and their active signature, including the associated gym plan
      const user = await prisma.user.findUnique({
        where: { userId: userId },
        select: {
          signatures: {
            select: {
              signatureId: true,
              Payment: {
                where: {
                  paymentStatus: {
                    paymentStatusName: "Pendente", // Use the status name instead of the ID
                  },
                },
                select: {
                  paymentId: true, // Select only the fields you need from the Payment model
                  amount: true, // You can add more fields here as required
                  date: true,
                },
              },
              gymPlan: {
                select: {
                  gymPlanId: true, // Select only gymPlanId field
                  price: true,
                  name: true,
                },
              },
            },
          },
        },
      });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Check if any signature has pending payments
      for (const signature of user.signatures) {
        if (signature.Payment && signature.Payment.length > 0) {
          res.status(405).json({
            message: `Tem ${signature.Payment.length} pagamentos pendentes`,
          });
          return; // Return after sending response
        }
      }

      // Step 2: Find the new gym plan
      const gymPlan = await prisma.gymPlan.findUnique({
        where: { gymPlanId: gymPlanId },
      });

      // Handle case where the gym plan is not found
      if (!gymPlan) {
        res.status(404).json({ message: "Gym plan not found" });
        return;
      }

      // Retrieve the user's current active signature (assuming only one is active)
      const currentSignature = user.signatures[0];
      if (!currentSignature) {
        res
          .status(400)
          .json({ message: "No active signature found for the user" });
        return;
      }

      const currentGymPlan = currentSignature.gymPlan;

      // Step 3: Check if the new gym plan matches the current gym plan
      if (gymPlan.gymPlanId === currentGymPlan.gymPlanId) {
        res.json({ message: "The selected gym plan is already active." });
        return;
      }

      // Step 4: Handle gym plan price difference
      if (gymPlan.price > currentGymPlan.price) {
        // Calculate the payment difference for upgrading
        const paymentDifference = gymPlan.price - currentGymPlan.price;
        console.log(`Paying ${paymentDifference} for the upgrade`);

        // Record the payment in the database
        const payment = await prisma.payment.create({
          data: {
            title: `Aprimoramento do ${currentGymPlan.name} para ${gymPlan.name}`,
            date: new Date(),
            amount: paymentDifference,
            signatureId: currentSignature.signatureId,
          },
        });

        // Signature isActive false until the user pays the upgrade
        await prisma.signature.update({
          where: { signatureId: currentSignature.signatureId },
          data: {
            gymPlanId: gymPlan.gymPlanId,
            isActive: false,
          },
        });

        res.json({
          message: "Gym plan updated successfully with payment.",
          payment,
        });
      } else {
        // Step 5: Update the signature for plans with no additional cost
        await prisma.signature.update({
          where: { signatureId: currentSignature.signatureId },
          data: {
            gymPlanId: gymPlan.gymPlanId,
            isActive: true,
          },
        });

        res.json({
          message: "Gym plan updated successfully without requiring payment.",
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new SignatureController();
