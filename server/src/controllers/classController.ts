import { Request, Response } from "express";

import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

class ClassController {
  async getAllClassTypes(req: Request, res: Response): Promise<void> {
    try {
      // Fetch all class types from the database
      const classTypes = await prisma.classType.findMany();

      // Send the result as a JSON response
      res.status(200).json(classTypes);
    } catch (error) {
      // Log the error and send a generic internal server error response
      console.error("Error in getAllClassTypes:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async getAllClasses(req: Request, res: Response): Promise<void> {
    try {
      // Fetch all classes with related exclusive gym plans
      const classes = await prisma.class.findMany({
        include: {
          classType: true, // Include class type details
          exclusiveGymPlans: true, // Include exclusive gym plans related to the class
        },
      });

      res.status(200).json(classes);
    } catch (error) {
      // Log the error and send a generic internal server error response
      console.error("Error in getAllClasses:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
export default new ClassController();
