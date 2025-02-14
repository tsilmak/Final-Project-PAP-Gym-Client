import { PrismaClient } from "@prisma/client";

import { Request, Response } from "express";
import { authentication, random } from "../helpers/authentication";
const prisma = new PrismaClient();

export const getUserWorkoutPlan = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.body;
  try {
    const workoutPlan = await prisma.workoutPlan.findMany({
      where: { userId },
      include: {
        madeByUser: {
          // Correct relation name
          select: { fname: true, lname: true }, // Selecting only fname and lname
        },
        exercises: {
          // Corrected relation name here
          include: {
            exercise: true, // Including the exercise details
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(workoutPlan); // Log the workout plans with exercises

    res.json(workoutPlan);
  } catch (error) {
    console.error("Error fetching workout plans:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
