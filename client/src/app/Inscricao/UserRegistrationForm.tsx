import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import HText from "@/components/HText";
import useMediaQuery from "@/hooks/useMediaQuery";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/high-res.css";
import { validatePhoneNumber } from "@/helpers/validatePhoneNumber";
import { useAppSelector, useAppDispatch } from "@/app/redux";
import { setSelectedGymPlan, setUser } from "@/state";
import { User, useUserCheckUniqueMutation } from "@/state/api";
import { isApiErrorResponse } from "@/helpers/isApiErrorResponse";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Country, CountryApiResponse } from "@/types";

type UserRegistrationFormProps = {
  onQuestions: () => void; // Callback to show questions
  errorMessageOnSubmition?: string;
};

const Registration: React.FC<UserRegistrationFormProps> = ({
  onQuestions,
  errorMessageOnSubmition,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  // Effect to handle incoming error messages
  useEffect(() => {
    if (
      typeof errorMessageOnSubmition === "string" &&
      errorMessageOnSubmition.trim() !== ""
    ) {
      setErrorMessage(errorMessageOnSubmition);
    } else {
      console.error(
        "Invalid errorMessageOnSubmition:",
        errorMessageOnSubmition
      );
      setErrorMessage(undefined);
    }
  }, [errorMessageOnSubmition]);

  const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");
  const dispatch = useAppDispatch(); // Get the dispatch function

  const selectedPlan = useAppSelector((state) => state.global.selectedGymPlan);

  const user = useAppSelector((state) => state.global.user);
  const [checkUnique, { isLoading }] = useUserCheckUniqueMutation();
  type UserForm = Omit<User, "confirmEmail" | "confirmPassword"> & {
    confirmEmail: string;
    confirmPassword: string;
  };
  const handleGoBack = () => dispatch(setSelectedGymPlan(null));
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm<UserForm>({
    defaultValues: {
      fname: user?.fname || "",
      lname: user?.lname || "",
      email: user?.email || "",
      confirmEmail: user?.email || "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      gender: user?.gender || "",
      birthDate: user?.birthDate || "",
      docType: user?.docType || "",
      docNumber: user?.docNumber || "",
      nif: "",
      countryNif: "",
      address: user?.address || "",
      address2: user?.address2 || "",
      zipcode: "",
      country: "",
      city: "",
      gymPlanId: selectedPlan?.gymPlanId,
    },
  });

  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [PhoneErrors, setPhoneErrors] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  console.log("msg", errorMsg);
  console.log(errorMessage);
  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    // Validate phone number with country code
    const isPhoneNumberValid = validatePhoneNumber("+" + value);
    setPhoneErrors(isPhoneNumberValid ? "" : "Número de telemóvel inválido");
  };

  const [cityError, setCityError] = useState("");
  const [isForeignNifChecked, setIsForeignNifChecked] = useState(false);

  const [countryData, setCountryData] = useState<Country[]>([]);

  // Fetch countries on first load
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,tld"
        );
        const data: CountryApiResponse[] = await response.json();

        // Map the data to extract only tld and name.common
        const countryData: Country[] = data.map((country) => ({
          tld: country.tld[0]?.replace(".", "") || "", // Extract the first tld and remove "."
          name: country.name.common, // Extract common name
        }));

        // Sort the countries alphabetically by name
        countryData.sort((a, b) => a.name.localeCompare(b.name));

        // Update the state with the fetched data
        setCountryData(countryData);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const fetchCityData = async (countryTld: string, zipcode: string) => {
    try {
      // Fetch city data using TLD
      const response = await fetch(
        `https://api.zippopotam.us/${countryTld}/${zipcode}`
      );
      if (response.ok) {
        const data = await response.json();
        setValue("city", data.places[0]["place name"]);
        setCityError(""); // Clear cityError if data is successfully fetched
        clearErrors("city");
      } else {
        setCityError("Código postal inválido");
        setValue("city", "");
        clearErrors("city");
      }
    } catch (error) {
      console.error("Error fetching city data:", error);
      setCityError("Erro ao verificar o código postal");
      setValue("city", "");
      clearErrors("city");
    }
  };

  const handleZipcodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const zipcodeValue = event.target.value;
    setValue("zipcode", zipcodeValue);
    trigger("zipcode");
  };

  // Handle changes to country and zipcode
  useEffect(() => {
    if (watch("country") && watch("zipcode")) {
      fetchCityData(watch("country"), watch("zipcode"));
    } else {
      setValue("city", "");
      clearErrors("city");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("country"), watch("zipcode")]);
  useEffect(() => {
    // Scroll to top of the page when errorMessage is set
    if (errorMessage || errorMsg) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [errorMessage, errorMsg]);
  const today = new Date();
  const minDate = new Date(
    today.getFullYear() - 16,
    today.getMonth(),
    today.getDate()
  ); // Minimum 16 years old
  const maxDate = new Date(
    today.getFullYear() - 110,
    today.getMonth(),
    today.getDate()
  );

  // Helper function to format dates as YYYY-MM-DD for the input max/min attributes
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const onSubmit = async (data: User) => {
    setErrorMessage("");
    setPhoneErrors("");

    if (!data.email || !data.nif) {
      setErrorMsg("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const isPhoneNumberValid = validatePhoneNumber("+" + phoneNumber);
    if (!isPhoneNumberValid) {
      setPhoneErrors("Número de telemóvel inválido");
      return;
    }
    setPhoneErrors("");

    data.phoneNumber = phoneNumber;

    if (!isForeignNifChecked) {
      data.countryNif = "PT";
    }
    data.countryNif = data.countryNif?.toLocaleUpperCase();

    data.nif = `${data.countryNif?.replace(".", "").toUpperCase() + data.nif}`;

    try {
      await checkUnique({ email: data.email, nif: data.nif }).unwrap();

      dispatch(setUser(data));
      onQuestions();
    } catch (error: unknown) {
      if (isApiErrorResponse(error)) {
        const errorMessage = `Infelizmente, ocorreu um erro no registo: ${error.data?.message || "Erro desconhecido, pedimos imensa desculpa!"}`;
        setErrorMsg(errorMessage);
      } else {
        const errorMessage =
          "Ocorreu um erro inesperado no registo. Pedimos imensa desculpa!";
        setErrorMsg(errorMessage);
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen ">
      <div
        className={`p-8 bg-background-alt-light dark:bg-background-alt rounded-lg shadow-md ${isAboveMediumScreens ? "w-1/2" : "max-w-xl"}`}
      >
        <div className="text-center mb-6 px-4 sm:px-8">
          <HText>
            2/3 Preenche o formulário de inscrição
            <br />
            <span className="text-secondary-400">
              Escolheste o plano {selectedPlan?.name} <br />
            </span>
          </HText>
          {(errorMessage || errorMsg) && (
            <div className="bg-red-500 text-white p-3 rounded mt-2">
              {errorMessage || errorMsg}
            </div>
          )}
        </div>
        <button
          onClick={handleGoBack}
          className="mb-6 dark:text-white hover:underline"
        >
          &larr; Voltar
        </button>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information Section */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <label
                htmlFor="fname"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Primeiro Nome
              </label>

              <input
                type="text"
                id="fname"
                className={` border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2.5 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400 ${errors.fname ? "border-red-500 dark:border-red-700" : ""}`}
                {...register("fname", {
                  required: "Insira o seu primeiro nome",
                  pattern: {
                    value: /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, // Regex for letters (including accented characters) and spaces
                    message: "Apenas letras são permitidas.",
                  },
                  maxLength: {
                    value: 30,
                    message: "Excedeu o limite de caracteres.",
                  },
                })}
                placeholder="Primeiro Nome"
                maxLength={30}
              />
              {errors.fname && (
                <span className="text-red-500 text-sm">
                  {errors.fname.message}
                </span>
              )}
            </div>

            <div className="w-full">
              <label
                htmlFor="lname"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Último Nome
              </label>
              <input
                type="text"
                id="lname"
                {...register("lname", {
                  required: "Insira o seu último nome",
                  pattern: {
                    value: /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, // Regex for letters (including accented characters) and spaces
                    message: "Apenas letras são permitidas.",
                  },
                  maxLength: {
                    value: 30,
                    message: "Excedeu o limite de caracteres.",
                  },
                })}
                className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2.5 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400 ${errors.lname ? "border-red-500 dark:border-red-700 " : ""}`}
                placeholder="Último Nome"
                maxLength={30}
              />
              {errors.lname && (
                <span className="text-red-500 text-sm">
                  {errors.lname.message}
                </span>
              )}
            </div>
          </div>

          {/* Email Fields */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                E-Mail
              </label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "Insira o seu e-mail",
                  maxLength: {
                    value: 100,
                    message: "Excedeu o limite de caracteres.",
                  },
                })}
                className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2.5 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400 ${errors.email ? "border-red-500 dark:border-red-700 " : ""}`}
                placeholder="exemplo@dominio.com"
                maxLength={100}
                autoComplete="on"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="w-full">
              <label
                htmlFor="confirmEmail"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Confirme o E-mail
              </label>
              <input
                type="confirmEmail"
                id="confirmEmail"
                {...register("confirmEmail", {
                  required: "Confirme o E-Mail",
                  maxLength: {
                    value: 100,
                    message: "Excedeu o limite de caracteres.",
                  },
                  validate: (value) =>
                    value === getValues("email") ||
                    "Os e-mails não correspondem",
                })}
                className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2.5 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400 ${errors.confirmEmail ? "border-red-500 dark:border-red-700" : ""}`}
                placeholder="exemplo@dominio.com"
                maxLength={100}
              />
              {errors.confirmEmail && (
                <span className="text-red-500 text-sm">
                  {errors.confirmEmail.message}
                </span>
              )}
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Palavra-Passe
              </label>
              <input
                type="password"
                id="password"
                {...register("password", {
                  required: "Insira a sua palavra-passe",
                  minLength: {
                    value: 8,
                    message:
                      "Não atende ao número mínimo de caracteres exigido.",
                  },
                  maxLength: {
                    value: 80,
                    message: "Excedeu o limite de caracteres.",
                  },
                })}
                placeholder="••••••••"
                minLength={8}
                maxLength={80}
                className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2.5 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400 ${errors.password ? "border-red-500 dark:border-red-700" : ""}`}
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="w-full">
              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Confirme a palavra-passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword", {
                  required: "Confirme a palavra-passe",
                  minLength: {
                    value: 8,
                    message:
                      "Não atende ao número mínimo de caracteres exigido.",
                  },
                  maxLength: {
                    value: 80,
                    message: "Excedeu o limite de caracteres.",
                  },
                  validate: (value) =>
                    value === getValues("password") ||
                    "A palavra-passe não combina",
                })}
                placeholder="••••••••"
                minLength={8}
                maxLength={80}
                className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2.5 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400 ${errors.confirmPassword ? "border-red-500 dark:border-red-700" : ""}`}
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>
          {/* Phone Input */}
          <div className="w-full">
            <label
              htmlFor="phoneNumber"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Número de telemóvel
            </label>
            <PhoneInput
              enableSearch
              placeholder="Escreve o teu número de telemóvel"
              country={"pt"}
              value={phoneNumber}
              onChange={handlePhoneChange}
              inputProps={{
                name: "phoneNumber",
                id: "phoneNumber",
                required: "O numero é obrigatorio",
              }}
              inputStyle={{
                border: PhoneErrors ? "1px solid red" : "1px solid #d1d5db ",
              }}
            />
            {PhoneErrors && (
              <span className="text-red-500 text-sm">{PhoneErrors}</span>
            )}
          </div>

          {/* Gender Field */}
          <div className="w-full">
            <label
              htmlFor="gender"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Gênero
            </label>
            <select
              id="gender"
              {...register("gender", {
                required: "Selecione o seu género",
              })}
              className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2.5 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400 ${errors.gender ? "border-red-500 dark:border-red-700" : ""}`}
            >
              <option value="">Selecione...</option>
              <option value="feminino">Feminino</option>
              <option value="masculino">Masculino</option>
              <option value="naoDivulgar">Prefiro não divulgar</option>
            </select>
            {errors.gender && (
              <span className="text-red-500 text-sm">
                {errors.gender.message}
              </span>
            )}
          </div>

          {/* Birth Date Field */}
          <div className="w-full">
            <label
              htmlFor="birthDate"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Data de Nascimento
            </label>
            <input
              type="date"
              id="birthDate"
              {...register("birthDate", {
                required: "Insira a sua data de nascimento",
                validate: (value) => {
                  const birthDate = new Date(value);

                  // Check if the birth date is within valid range
                  if (birthDate > minDate) {
                    return "Data de Nascimento inválida. Necessário ter pelo menos 16 anos.";
                  }
                  if (birthDate < maxDate) {
                    return "Data de Nascimento inválida. Não pode ter mais de 110 anos.";
                  }
                  return true;
                },
              })}
              className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2.5 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400 ${errors.birthDate ? "border-red-500 dark:border-red-700" : ""}`}
              max={formatDate(minDate)} // Set max date to 16 years ago
              min={formatDate(maxDate)} // Set min date to 110 years ago
            />
            {errors.birthDate && (
              <span className="text-red-500 text-sm">
                {errors.birthDate.message}
              </span>
            )}
          </div>

          {/* Documents information  */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <label
                htmlFor="docType"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Tipo do Documento
              </label>

              <select
                id="docType"
                {...register("docType", {
                  required: "Indica o tipo de documento",
                })}
                className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2.5 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400 ${errors.docType ? "border-red-500 dark:border-red-700" : ""}`}
              >
                <option value="">Selecione...</option>
                <option value="cc">Cartão de Cidadão</option>
                <option value="bi">Bilhete de Identidade Militar</option>
                <option value="cn">Certidão de Nascimento</option>
                <option value="p">Passaporte</option>
              </select>
              {errors.docType && (
                <span className="text-red-500 text-sm">
                  {errors.docType.message}
                </span>
              )}
            </div>
            <div className="w-full">
              <label
                htmlFor="docNumber"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Número do documento
              </label>
              <input
                type="text"
                id="docNumber"
                {...register("docNumber", {
                  required: "Indica a identificação do documento",
                  pattern: {
                    value: /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s]+$/,
                    message: "Apenas letras e números são permitidos.",
                  },
                  minLength: {
                    value: 5,
                    message:
                      "Não atende ao número mínimo de caracteres exigido.",
                  },
                  maxLength: {
                    value: 25,
                    message: "Excedeu o limite de caracteres.",
                  },
                })}
                className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2.5 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400 ${errors.docNumber ? "border-red-500 dark:border-red-700" : ""}`}
                placeholder="Número do documento"
                minLength={5}
                maxLength={25}
              />
              {errors.docNumber && (
                <span className="text-red-500 text-sm">
                  {errors.docNumber.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <label
                htmlFor="nif"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Número de Identificação Físcal
              </label>
              <input
                type="number"
                id="nif"
                {...register("nif", {
                  required: "Insira o seu nif",
                  minLength: {
                    value: 5,
                    message:
                      "Não atende ao número mínimo de caracteres exigido.",
                  },
                  maxLength: {
                    value: 20,
                    message: "Excedeu o limite de caracteres.",
                  },
                })}
                className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2.5 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400 ${errors.nif ? "border-red-500 dark:border-red-700" : ""}`}
                placeholder="Número do documento"

                // min={5}
                // max={20}
              />
              {errors.nif && (
                <span className="text-red-500 text-sm">
                  {errors.nif.message}
                </span>
              )}
              <div className="mt-2">
                <input
                  id="foreign-nif-checkbox"
                  type="checkbox"
                  value=""
                  className="w-4 h-4 text-secondary-400 bg-gray-100 dark:bg-background-color-light rounded focus:ring-white "
                  onChange={(e) => setIsForeignNifChecked(e.target.checked)}
                />
                <label
                  htmlFor="foreign-nif-checkbox"
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-white "
                >
                  NIF Estrangeiro
                </label>
              </div>
            </div>
            {isForeignNifChecked && (
              <div className="w-full">
                <label
                  htmlFor="countryNif"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  País de origem do NIF
                </label>
                <select
                  id="countryNif"
                  {...register("countryNif", {
                    required: "Escolha uma opção",
                  })}
                  className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2.5 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400 ${errors.countryNif ? "border-red-500 dark:border-red-700" : ""}`}
                >
                  <option value="">Selecione...</option>
                  {countryData.map((countryNif) => (
                    <option key={countryNif.name} value={countryNif.tld}>
                      {countryNif.name}
                    </option>
                  ))}
                </select>
                {errors.countryNif && (
                  <span className="text-red-500 text-sm">
                    {errors.countryNif.message}
                  </span>
                )}
              </div>
            )}
          </div>
          {/* Address Field */}
          <div className="w-full">
            <label
              htmlFor="address"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Morada
            </label>
            <input
              id="address"
              {...register("address", {
                required: "Insira a sua morada",
                minLength: {
                  value: 5,
                  message: "Não atende ao número mínimo de caracteres exigido.",
                },
                maxLength: {
                  value: 255,
                  message: "Excedeu o limite de caracteres.",
                },
              })}
              className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2.5 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400 ${errors.address ? "border-red-500 dark:border-red-700" : ""}`}
              placeholder="Insira a sua morada"
              minLength={5}
              maxLength={255}
              autoComplete="on"
            />
            {errors.address && (
              <span className="text-red-500 text-sm">
                {errors.address.message}
              </span>
            )}
          </div>

          {/* Address 2 Field */}
          <div className="w-full">
            <label
              htmlFor="address2"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Morada 2
            </label>
            <input
              id="address2"
              {...register("address2", {
                minLength: {
                  value: 5,
                  message: "Não atende ao número mínimo de caracteres exigido.",
                },
                maxLength: {
                  value: 255,
                  message: "Excedeu o limite de caracteres.",
                },
              })}
              className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2.5 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400 ${errors.address2 ? "border-red-500 dark:border-red-700" : ""}`}
              placeholder="Continuação da Morada"
            />
            {errors.address2 && (
              <span className="text-red-500 text-sm">
                {errors.address2.message}
              </span>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Country Field */}
            <div className="w-full">
              <label
                htmlFor="country"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                País
              </label>
              <select
                id="country"
                {...register("country", { required: "Escolha uma opção" })}
                className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2.5 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400 ${errors.country ? "border-red-500 dark:border-red-700" : ""}`}
                autoComplete="xx"
              >
                <option value="">Selecione...</option>
                {countryData.map((country) => (
                  <option key={country.name} value={country.tld}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.country && (
                <span className="text-red-500 text-sm">
                  {errors.country.message}
                </span>
              )}
            </div>
            {/* Zip-Code Field */}
            <div className="w-full">
              <label
                htmlFor="zipcode"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Código Postal
              </label>
              <input
                id="zipcode"
                {...register("zipcode", {
                  required: "Informe o seu código postal",
                  maxLength: {
                    value: 12,
                    message: "Excedeu o limite de caracteres.",
                  },
                })}
                onChange={handleZipcodeChange}
                placeholder="0000-000"
                max={12}
                className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2.5 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400 ${errors.zipcode ? "border-red-500 dark:border-red-700" : ""}`}
                autoComplete="xxx"
              />

              {errors.zipcode && (
                <span className="text-red-500 text-sm">
                  {errors.zipcode.message}
                </span>
              )}
            </div>

            <div className="w-full">
              <label
                htmlFor="city"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Cidade
              </label>
              <input
                disabled
                id="city"
                {...register("city", {
                  required: getValues("city") ? false : "Cidade é obrigatória",
                })}
                placeholder={getValues("city") || ""}
                className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2.5 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400 ${errors.city ? "border-red-500 dark:border-red-700" : ""}`}
              />
              {cityError && (
                <span className="text-red-500 text-sm">{cityError}</span>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="bg-secondary-400 text-partial-black inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-medium  focus:ring-4 transition-colors duration-300 ease-in-out"
            >
              {isLoading ? <LoadingSpinner /> : "Seguinte"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
