import { Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class ExerciseController {
  async getAllExercises(req: Request, res: Response): Promise<void> {
    try {
      const allExercises = await prisma.exercise.findMany();

      res.status(200).json(allExercises);
    } catch (error) {
      // Log the error and send a generic internal server error response
      console.error("Error in getAllClasses:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new ExerciseController();
