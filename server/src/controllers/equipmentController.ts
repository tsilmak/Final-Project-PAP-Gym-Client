import { Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class EquipmentController {
  async getCardioEquipment(req: Request, res: Response): Promise<void> {
    try {
      const cardioEquipment = await prisma.machine.findMany({
        where: {
          type: "Cardio",
        },
      });

      res.status(200).json(cardioEquipment);
    } catch (error) {
      // Log the error and send a generic internal server error response
      console.error("Error in getAllClasses:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async getFunctionalEquipment(req: Request, res: Response): Promise<void> {
    try {
      const functionalEquipment = await prisma.machine.findMany({
        where: {
          type: "Funcional",
        },
      });

      res.status(200).json(functionalEquipment);
    } catch (error) {
      // Log the error and send a generic internal server error response
      console.error("Error in getAllClasses:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async getStrengthEquipment(req: Request, res: Response): Promise<void> {
    try {
      const strengthEquipment = await prisma.machine.findMany({
        where: {
          type: "Musculacao",
        },
      });

      res.status(200).json(strengthEquipment);
    } catch (error) {
      // Log the error and send a generic internal server error response
      console.error("Error in getAllClasses:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new EquipmentController();
