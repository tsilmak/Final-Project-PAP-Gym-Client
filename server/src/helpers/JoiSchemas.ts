import Joi from "joi";
import { fetchCountryTlds } from "./userHelpers";

const userRegistrationSchema = async () => {
  // Fetch the country TLDs asynchronously
  const validCountryTlds = await fetchCountryTlds();

  return Joi.object({
    fname: Joi.string()
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)
      .max(30)
      .required(),
    lname: Joi.string()
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)
      .max(30)
      .required(),
    email: Joi.string().email().max(100).required(),
    confirmEmail: Joi.string()
      .email()
      .required()
      .valid(Joi.ref("email"))
      .messages({
        "any.only": "O e-mail de confirmação deve ser igual ao e-mail.",
        "any.required": "Confirmação do e-mail é obrigatória.",
      }),
    password: Joi.string().min(8).max(80).required(),
    confirmPassword: Joi.string()
      .required()
      .valid(Joi.ref("password"))
      .messages({
        "any.only": "A senha de confirmação deve ser igual à senha.",
        "any.required": "Confirmação da senha é obrigatória.",
      }),
    phoneNumber: Joi.string().required(),
    gender: Joi.string()
      .valid("feminino", "masculino", "naoDivulgar")
      .required(),

    birthDate: Joi.date()
      .less("now")
      .max(new Date(new Date().setFullYear(new Date().getFullYear() - 16)))
      .required()
      .messages({
        "date.less": "A data de nascimento não pode ser no futuro.",
        "date.max": "É necessário ter pelo menos 16 anos.",
        "any.required": "Insira a sua data de nascimento.",
      }),
    docType: Joi.string().valid("cc", "bi", "cn", "p").required().messages({
      "any.required": "Indica o tipo de documento",
      "any.only": "Tipo de documento inválido. Selecione uma opção válida.",
    }),
    docNumber: Joi.string().min(5).max(25).required(),
    nif: Joi.string().min(5).max(22).required(),
    address: Joi.string().min(5).max(255).required(),
    address2: Joi.string().min(5).max(255).allow(""),
    country: Joi.string()
      .valid(...validCountryTlds)
      .required()
      .messages({
        "any.required": "País é obrigatório.",
        "any.only": "O país selecionado não é válido.",
      }),
    city: Joi.string().required(),
    zipcode: Joi.string().required(),
    registrationFee: Joi.number().min(0),
    gymPlanId: Joi.number().integer().required(),
  });
};

export { userRegistrationSchema };
