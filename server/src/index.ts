import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// Route Imports
import gymPlanRoutes from "./routes/gymPlanRoutes";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import stripeRoutes from "./routes/stripeRoutes";
import paymentsRoutes from "./routes/paymentRoutes";
import blogsRoutes from "./routes/blogRoutes";
import classRoutes from "./routes/classRoutes";
import signatureRoutes from "./routes/signatureRoutes";
import equipmentRoutes from "./routes/equipmentRoutes";
import exerciseRoutes from "./routes/exerciseRoutes";
import workoutRoutes from "./routes/workoutRoutes";
import {
  handlePaymentIntentFailed,
  handlePaymentIntentSucceeded,
} from "./helpers/stripe/handlePaymentIntentSucceeded";

// Configuration
dotenv.config();
const app = express();
app.disable("x-powered-by");

app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // frontend origin
    credentials: true, // Allow credentials (cookies) to be sent
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));
app.use(express.json());

app.use("/blog", blogsRoutes);
app.use("/payments", paymentsRoutes);
app.use("/stripe", stripeRoutes);
app.use("/auth", authRoutes);
app.use("/gymPlans", gymPlanRoutes);
app.use("/signature", signatureRoutes);
app.use("/class", classRoutes);
app.use("/user", userRoutes);
app.use("/equipment", equipmentRoutes);
app.use("/exercise", exerciseRoutes);
app.use("/workout", workoutRoutes);

//STRIPE WEBHOOK
app.post(
  "/webhook",
  express.json({ type: "application/json" }),
  (request, response) => {
    const event = request.body;

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;

        const paymentId = paymentIntent.metadata?.paymentId;
        const isSubscription = paymentIntent.metadata?.isSubscription;
        console.log("", paymentIntent.metadata);
        const stripePaymentId = paymentIntent.id;

        if (!paymentId) {
          console.error("paymentId missing in PaymentIntent metadata.");
          response
            .status(400)
            .json({ error: "Payment ID missing in metadata." });
          return;
        }
        console.log(`PaymentIntent succeeded for paymentId: ${paymentId}`);

        handlePaymentIntentSucceeded(
          paymentId,
          stripePaymentId,
          isSubscription
        );
        break;
      case "payment_intent.payment_failed":
        const paymentIntentFailed = event.data.object;
        console.log(paymentIntentFailed);
        const paymentIdFailed = paymentIntentFailed.metadata?.paymentId;
        console.log(paymentIdFailed);

        const stripePaymentIdFailed = paymentIntentFailed.id;

        console.log(stripePaymentIdFailed);

        if (!paymentId) {
          console.error("paymentId missing in PaymentIntent metadata.");
          response
            .status(400)
            .json({ error: "Payment ID missing in metadata." });
          return;
        }
        console.log(`PaymentIntent succeeded for paymentId: ${paymentId}`);

        handlePaymentIntentFailed(paymentIdFailed, stripePaymentIdFailed);
        break;
      case "payment_method.attached":
        const paymentMethod = event.data.object;
        console.log(paymentMethod);
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
  }
);

app.listen(process.env.PORT || 3005, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
