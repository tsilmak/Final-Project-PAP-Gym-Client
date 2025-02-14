import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authentication, random } from "../helpers/authentication";
import Joi from "joi";

const prisma = new PrismaClient();

export const userChangePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, prevPassword, newPassword, confirmPassword } = req.body;
  if (prevPassword === newPassword) {
    res.status(404).json({
      message: "A nova palavra-passe não pode ser a mesma que a anterior..",
    });
    return;
  }
  // Define Joi validation schema for the password change
  const passwordChangeSchema = Joi.object({
    prevPassword: Joi.string().min(8).max(80).required().messages({
      "string.min": "Não atende ao número mínimo de caracteres exigido.",
      "string.max": "Excedeu o limite de caracteres.",
      "any.required": "Insira a sua palavra-passe.",
    }),
    newPassword: Joi.string().min(8).max(80).required().messages({
      "string.min":
        "Nova palavra-passe não atende ao número mínimo de caracteres.",
      "any.required": "Nova palavra-passe é obrigatória.",
    }),
    confirmPassword: Joi.string()
      .valid(Joi.ref("newPassword"))
      .required()
      .messages({
        "any.only": "As palavras-passe não coincidem.",
        "any.required": "Por favor, confirme sua nova palavra-passe.",
      }),
  });

  // Validate the request body against the schema
  const { error } = passwordChangeSchema.validate({
    prevPassword,
    newPassword,
    confirmPassword,
  });

  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  try {
    // Find the user by userId
    const user = await prisma.user.findUnique({
      where: { userId },
      select: {
        salt: true,
        hashedPassword: true,
      },
    });

    // Check if the user exists
    if (!user) {
      res
        .status(404)
        .json({ message: "Não foi encontrado nenhum utilizador." });
      return;
    }

    const { salt, hashedPassword } = user;

    // Verify the provided old password
    const hashedInputPassword = authentication(salt, prevPassword);

    if (hashedInputPassword !== hashedPassword) {
      res
        .status(400)
        .json({ message: "A Palavra-Passe anterior está errada." });
      return;
    }

    // Hash the new password and generate a new salt
    const newSalt = random();
    const hashedNewPassword = authentication(newSalt, newPassword);

    // Update the user's password in the database
    await prisma.user.update({
      where: { userId },
      data: {
        salt: newSalt,
        hashedPassword: hashedNewPassword,
      },
    });

    res.status(200).json({ message: "A Palavra-Passe foi atualizada." });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Error changing password." });
  }
};
export const userProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("Incoming Request Body:", req.body);
    // Destructure id from the request body

    const { userId } = req.body;
    console.log("User ID from request:", userId);

    // Validate that the user ID is provided
    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return; // Exit early to avoid unnecessary processing
    }

    // Fetch user details based on the user ID
    const userProfile = await prisma.user.findFirst({
      where: {
        userId: userId,
      },
      select: {
        fname: true,
        lname: true,
        email: true,
        phoneNumber: true,
        gender: true,
        birthDate: true,
        docType: true,
        docNumber: true,
        nif: true,
        address: true,
        address2: true,
        zipcode: true,
        country: true,
        city: true,
        profilePictureUrl: true,
        membershipNumber: true,
        signatures: {
          select: {
            gymPlanId: true,
          },
        },
      },
    });
    // Respond with the retrieved user details
    res.status(200).json(userProfile);
  } catch (error) {
    console.error("Error fetching user details:", error); // Log the error for debugging
    res.status(500).json({ message: "Internal server error" });
  }
};
export const userCheckIfUniqueData = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, nif } = req.body;
  console.log(req.body);
  if (!email || !nif) {
    res.status(400).json({
      message: "Email and NIF are required.",
    });
    return;
  }
  try {
    // Check if the email or NIF already exists in the database
    const userWithEmail = await prisma.user.findUnique({
      where: { email },
    });

    const userWithNif = await prisma.user.findUnique({
      where: { nif },
    });

    // If email or NIF exists, respond with the corresponding message
    if (userWithEmail) {
      res.status(400).json({ message: `O ${email} já se encontra registado.` });
      return;
    }

    if (userWithNif) {
      res.status(400).json({ message: `NIF ${nif} já se encontra registado.` });
      return;
    }

    // If both are unique, respond with success
    res.status(200).json({ message: "Email & NIF unicos." });
  } catch (error) {
    // Handle potential errors
    res.status(500).json({
      message: "Ocorreu um erro inesperado ao verificar o email e nif.",
      error,
    });
  }
};

export const getSignatureFromUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Assuming the userId is being sent in the request body
    const { userId } = req.body;

    // Fetch signature using the userId
    const userSignature = await prisma.user.findUnique({
      where: { userId: userId },
      select: {
        signatures: {
          include: {
            gymPlan: true, // Include the related GymPlan for each signature
          },
        },
      },
    });
    console.log(userSignature);

    if (!userSignature) {
      // If no signature is found, send a 404 response
      res.status(404).json({ message: "Signature not found" });
      return;
    }

    // Send the signature data as a response
    res.json(userSignature);
  } catch (error) {
    console.error("Error in fetching signature:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const changeUserDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, signatures, countryNif, ...updateData } = req.body;

  try {
    // Validate and format `birthDate`, if provided
    if (updateData.birthDate) {
      updateData.birthDate = new Date(updateData.birthDate);
    }

    // Update the user details
    const updatedUser = await prisma.user.update({
      where: { userId },
      data: updateData,
      select: {
        fname: true,
        lname: true,
        email: true,
        phoneNumber: true,
        gender: true,
        birthDate: true,
        docType: true,
        docNumber: true,
        nif: true,
        address: true,
        address2: true,
        zipcode: true,
        country: true,
        city: true,
        profilePictureUrl: true,
      },
    });

    res.status(200).json({
      message: "Dados atualizados com sucesso.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({
      message: "Erro ao atualizar os dados do utilizador.",
    });
  }
};
