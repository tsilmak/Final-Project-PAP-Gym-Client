export interface PaymentMethod {
  methodType: "iban" | "paypal";
  paypalEmail?: string;
  iban?: string;
}
