import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getGymPlans = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const gymPlans = await prisma.gymPlan.findMany({
      where: {
        isActive: true,
      },
    });
    res.json(gymPlans);
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Ocorreu um erro ao obter os planos de ginásio." });
  }
};
export const getGymPlanById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const gymPlan = await prisma.gymPlan.findFirst({
      where: {
        gymPlanId: Number(id),
      },
      select: {
        name: true,
      },
    });
    res.json(gymPlan);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Ocorreu um erro ao obter o plano de ginásio." });
  }
};
