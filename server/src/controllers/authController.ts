import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authentication, random } from "../helpers/authentication";
import { PrismaClient } from "@prisma/client";
import {
  countryToTaxIdType,
  fetchCityData,
  fetchCountryTlds,
  generateMembershipNumber,
} from "../helpers/userHelpers";
import Joi from "joi";
import { userRegistrationSchema } from "../helpers/JoiSchemas";

const stripe = require("stripe")(process.env.STRIPE_KEY);

const prisma = new PrismaClient();

class AuthController {
  async refresh(req: Request, res: Response): Promise<void> {
    const cookies = req.cookies;
    // Check if the JWT cookie is present
    if (!cookies?.jwt) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const refreshToken = cookies.jwt;
    console.log(refreshToken);

    try {
      // Check if REFRESH_TOKEN_SECRET is set in the environment
      if (!process.env.REFRESH_TOKEN_SECRET) {
        console.error(
          "REFRESH_TOKEN_SECRET not set! Terminating the application..."
        );
        process.exit(1);
      }

      // Verify the refresh token
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err: jwt.VerifyErrors | null, decoded: any) => {
          if (err || !decoded?.userId) {
            return res.status(403).json({ message: "Forbidden" });
          }

          // Fetch the user from the database using Prisma
          const user = await prisma.user.findUnique({
            where: { userId: decoded.userId },
            select: {
              userId: true,
              fname: true,
              lname: true,
              profilePictureUrl: true,
              membershipNumber: true,
              createdAt: true,
            },
          });

          if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
          }
          // Check if REFRESH_TOKEN_SECRET is set in the environment
          if (!process.env.ACCESS_TOKEN_SECRET) {
            console.error(
              "process.env.ACCESS_TOKEN_SECRET not set! Terminating the application..."
            );
            process.exit(1);
          }
          // Generate a new access token
          const accessToken = jwt.sign(
            {
              userId: user.userId,
            },
            process.env.ACCESS_TOKEN_SECRET, // Should use ACCESS_TOKEN_SECRET if separate
            { expiresIn: "15m" }
          );

          // Send response with the access token and user details
          res.json({
            accessToken,
            user: {
              firstName: user.fname,
              lastName: user.lname,
              memberSince: new Date(user.createdAt).toLocaleDateString("pt-PT"),
              membershipNumber: user.membershipNumber,
              profilePictureUrl: user.profilePictureUrl,
            },
          });
        }
      );
    } catch (error) {
      console.error("Error in refresh:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const {
        fname,
        lname,
        email,
        phoneNumber,
        gender,
        birthDate,
        docType,
        docNumber,
        password,
        nif,
        address,
        address2,
        zipcode,
        country,
        city,
        gymPlanId,
        signatureEndDate,
      } = req.body;
      //need to get the gymplan id and with that get the price stripe and product stripe
      const gymPlan = await prisma.gymPlan.findUnique({
        where: {
          gymPlanId: parseInt(gymPlanId, 10),
        },
        select: {
          name: true,
          price: true,
          productStripeId: true,
          priceStripeId: true,
        },
      });
      if (!gymPlan) {
        console.error("Plano de ginásio inválido: n existe nenhum plano");
        res.status(400).json({ message: "Plano de ginásio inválido" });
        return;
      }

      // Validation checks remain the same
      const schema = await userRegistrationSchema();
      const { error } = schema.validate(req.body);
      if (error) {
        console.error(
          "Ocorreu um erro na validação dos dados enviados:",
          error.details
        );
        res.status(400).json({ message: error.details[0].message });
        return;
      }

      // City validation remains the same
      const cityData = await fetchCityData(country, zipcode);
      if (cityData.error || cityData.city !== city) {
        console.log(`Invalid city: ${city}. Expected: ${cityData.city}`);
        res.status(400).json({
          message: `O código postal ou a cidade informada é inválida, por favor verifique se ${zipcode} condiz com ${city}`,
        });
        return;
      }

      // Existing user checks remain the same
      const existingUserByNif = await prisma.user.findUnique({
        where: { nif: nif },
      });

      if (existingUserByNif) {
        console.log(`NIF "${nif}" already exists`);
        res.status(400).json({
          message: `O NIF "${nif}" já está registado.`,
        });
        return;
      }

      const existingUserByEmail = await prisma.user.findUnique({
        where: { email: email },
      });

      if (existingUserByEmail) {
        console.log(`Email "${email}" already exists`);
        res.status(400).json({
          message: `O email "${email}" já está registado.`,
        });
        return;
      }

      const membershipNumber = await generateMembershipNumber();
      const salt = random();
      const hashedPassword = authentication(salt, password);

      // Modified transaction to handle user creation first
      await prisma.$transaction(async () => {
        // Create Stripe customer first
        const stripeCustomer = await stripe.customers.create({
          name: `${fname} ${lname}`,
          email: email,
          phone: phoneNumber,
          address: {
            line1: address,
            line2: address2 || "",
            city: city,
            postal_code: zipcode,
            country: country,
          },
        });
        console.log("Stripe customer created:", stripeCustomer.id);

        // Create user
        const newUser = await prisma.user.create({
          data: {
            membershipNumber,
            hashedPassword,
            salt,
            fname,
            lname,
            email,
            phoneNumber,
            gender,
            birthDate: new Date(birthDate),
            docType,
            docNumber,
            nif,
            address,
            address2,
            zipcode,
            country,
            city,
            customerStripeId: stripeCustomer.id,
            role: {
              connect: { rolesId: 1 },
            },
          },
        });
        console.log("New user created:", newUser);

        // Check if payment was successful

        const userSignature = await prisma.signature.create({
          data: {
            gymPlanId,
            startDate: new Date(),
            endDate: signatureEndDate ? new Date(signatureEndDate) : null,
            userId: newUser.userId,
          },
        });
        console.log("Signature created for user:", newUser.userId);
        // Create pending payment record
        const newPayment = await prisma.payment.create({
          data: {
            title: `Registo para o plano ${gymPlan.name}`,
            date: new Date(),
            amount: Number(gymPlan.price),
            signature: {
              connect: { signatureId: Number(userSignature.signatureId) },
            },
            paymentStatus: {
              connect: { paymentStatusId: 1 }, // 1 is for pending status
            },
          },
        });

        const paymentId = newPayment.paymentId;
        //amount that the user will pay
        const amountToPay = newPayment.amount;

        if (
          !process.env.REFRESH_TOKEN_SECRET ||
          !process.env.ACCESS_TOKEN_SECRET ||
          !process.env.PAYMENT_INFO_JWT_SECRET
        ) {
          throw new Error("Token secrets not properly configured");
        }

        // Generate Access and Refresh Tokens
        const accessToken = jwt.sign(
          {
            userId: newUser.userId,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );
        //envia pelos cookies
        const newRefreshToken = jwt.sign(
          { userId: newUser.userId },
          process.env.REFRESH_TOKEN_SECRET,
          {
            expiresIn: "30d",
          }
        );

        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        const paymentToken = jwt.sign(
          { paymentId: newPayment.paymentId },
          process.env.PAYMENT_INFO_JWT_SECRET,
          { expiresIn: "30m" }
        );
        // Return customer ID and payment intent for frontend handling
        res.status(201).json({
          paymentId,
          amountToPay,
          paymentToken,
          accessToken,
          user: {
            firstName: newUser.fname,
            lastName: newUser.lname,
            memberSince: new Date(newUser.createdAt).toLocaleDateString(
              "pt-PT"
            ),
            membershipNumber: newUser.membershipNumber,
            profilePictureUrl: newUser.profilePictureUrl,
          },
        });
      });
    } catch (error) {
      console.log("Error occurred:", error);
      if (!res.headersSent) {
        res.status(500).json({ message: (error as Error).message });
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email ou password não fornecidas." });
      return;
    }
    if (email === "admin@gymhub.com" || email === "treinador@gymhub.com") {
      res
        .status(400)
        .json({
          message:
            "Administradores teste, por favor faça login no painel administrativo.",
        });
      return;
    }

    try {
      // Find the user by email
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          email: true,
          userId: true,
          fname: true,
          lname: true,
          profilePictureUrl: true,
          membershipNumber: true,
          salt: true,
          hashedPassword: true,
          createdAt: true,
        },
      });
      if (!user) {
        res.status(401).json({ message: "Credenciais de acesso inválidas" });
        return;
      }

      const { salt, hashedPassword } = user;
      const hashedInputPassword = authentication(salt, password);

      if (hashedInputPassword !== hashedPassword) {
        res.status(401).json({ message: "Credenciais de acesso inválidas." });
        return;
      }

      if (!process.env.ACCESS_TOKEN_SECRET) {
        console.error(
          "ACCESS_TOKEN_SECRET não foi informado! A terminar a aplicação..."
        );
        process.exit(1);
      }

      if (!process.env.REFRESH_TOKEN_SECRET) {
        console.error(
          "REFRESH_TOKEN_SECRET não foi informado! A terminar a aplicação..."
        );
        process.exit(1);
      }
      // Generate Access and Refresh Tokens
      const accessToken = jwt.sign(
        {
          userId: user.userId,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30m" }
      );
      //envia pelos cookies
      const newRefreshToken = jwt.sign(
        { userId: user.userId },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "30d",
        }
      );
      // Set the new refresh token as an HttpOnly cookie
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.json({
        accessToken,
        user: {
          firstName: user.fname,
          lastName: user.lname,
          memberSince: new Date(user.createdAt).toLocaleDateString("pt-PT"),
          membershipNumber: user.membershipNumber,
          profilePictureUrl: user.profilePictureUrl,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async logout(req: Request, res: Response): Promise<void> {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      res.sendStatus(204);
      return;
    } //No content
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    res.json({ message: "A sessão foi encerrada com sucesso" });
  }
}

export default new AuthController();
