import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  useChangeUserDetailsMutation,
  User,
  useUserProfileQuery,
} from "@/state/api";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PasswordModal from "./PasswordModal";
import PhoneInput from "react-phone-input-2";
import { validatePhoneNumber } from "@/helpers/validatePhoneNumber";
import { Country, CountryApiResponse } from "@/types";
import { useNavigate } from "react-router-dom";
import UserSidebar from "@/components/UserNavbar";

const Perfil = () => {
  const {
    data: userData,
    error: userFetchError,
    isLoading: userFetchIsLoading,
  } = useUserProfileQuery();
  const [changeUserDetails, { isLoading: isLoadingChangeUserDetails }] =
    useChangeUserDetailsMutation();
  const [, setPhoneNumber] = useState<string>("");
  const [PhoneErrors, setPhoneErrors] = useState<string>("");

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    // Validate phone number with country code
    const isPhoneNumberValid = validatePhoneNumber("+" + value);
    setPhoneErrors(isPhoneNumberValid ? "" : "Número de telemóvel inválido");
  };
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

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    watch,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<User>({
    defaultValues: {
      countryNif: "",
      nif: "",
      birthDate: "",
      ...userData, // Overrides defaults when userData is available
    },
  });
  useEffect(() => {
    // Ensure userData is loaded before resetting
    const nif = userData?.nif;
    const nifLetters = nif?.slice(0, 2).toLowerCase();
    const nifWithoutLetters = nif?.slice(2);
    const formattedBirthDate = userData?.birthDate
      ? new Date(userData.birthDate).toISOString().split("T")[0]
      : "";

    reset({
      ...userData,
      countryNif: nifLetters,
      nif: nifWithoutLetters,
      birthDate: formattedBirthDate,
    });
  }, [userData, reset, setValue]);
  const [isModalPasswordOpen, setIsModalPasswordOpen] =
    useState<boolean>(false);
  const showPasswordChangeModal = () => {
    setIsModalPasswordOpen(!isModalPasswordOpen);
  };

  const [cityError, setCityError] = useState("");

  const handleZipcodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const zipcodeValue = event.target.value;
    setValue("zipcode", zipcodeValue);
    trigger("zipcode");
  };
  const [countryData, setCountryData] = useState<Country[]>([]);
  const navigate = useNavigate();

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
      const response = await fetch(
        `https://api.zippopotam.us/${countryTld}/${zipcode}`
      );
      if (response.ok) {
        const data = await response.json();
        setValue("city", data.places[0]["place name"]);
        setCityError("");
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

  useEffect(() => {
    if (watch("country") && watch("zipcode")) {
      fetchCityData(watch("country"), watch("zipcode"));
    } else {
      setValue("city", "");
      clearErrors("city");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("country"), watch("zipcode")]);
  if (userFetchError) {
    navigate("/");
    return null;
  }

  const onSubmit = async (data: User) => {
    console.log(data);
    const response = await changeUserDetails(data).unwrap();
    console.log(response);
  };

  return (
    <section
      id="perfil"
      className="py-28 bg-background-alt-light dark:bg-background-color text-primary-500 dark:text-white flex min-h-full"
    >
      <UserSidebar />
      {/* Container for the profile and form sections */}
      <div className="dark:bg-background-alt max-w-9xl p-8 shadow-lg rounded-lg mx-auto w-5/6 ">
        <h2 className="text-3xl font-semibold text-center mb-5">Perfil</h2>
        {/* DATA LOADING */}
        {userFetchIsLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Profile Section */}
            <div className="flex flex-col items-center space-y-6 mb-8 text-center">
              {/* Profile Image */}
              <img
                src={userData?.profilePictureUrl}
                alt="Profile"
                className="w-32 h-32 rounded-full"
              />

              {/* User Info */}
              <div>
                <h3 className="text-2xl font-medium">
                  {userData?.fname + " " + userData?.lname}
                </h3>
                <p className="text-secondary-400"> {userData?.email}</p>
                <p className="text-secondary-400">
                  {userData?.membershipNumber}
                </p>
              </div>
            </div>

            {/* Form Section */}
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  {/* Add relative positioning for the tooltip */}
                  <label
                    htmlFor="fname"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Primeiro Nome
                  </label>
                  <input
                    type="text"
                    id="fname"
                    className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2.5 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400 ${errors.fname ? "border-red-500" : ""}`}
                    {...register("fname")}
                    readOnly
                    onFocus={() => {
                      // Set error when the input is focused
                      setError("fname", {
                        type: "manual",
                        message: `Por questões de segurança, para alterar o primeiro nome, por favor entra em contacto.`,
                      });
                    }}
                    onBlur={() => {
                      // Clear the error when the input loses focus
                      clearErrors("fname");
                    }}
                  />
                  {/* Error message if any */}
                  {errors.fname && (
                    <span className="text-red-500 text-sm">
                      {errors.fname.message}
                    </span>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="lname"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Último Nome
                  </label>
                  <input
                    type="text"
                    id="lname"
                    className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2.5 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400 ${errors.lname ? "border-red-500" : ""}`}
                    {...register("lname")}
                    readOnly
                    onFocus={() => {
                      // Set error when the input is focused
                      setError("lname", {
                        type: "manual",
                        message: `Por questões de segurança, para alterar o último nome, por favor entra em contacto.`,
                      });
                    }}
                    onBlur={() => {
                      // Clear the error when the input loses focus
                      clearErrors("lname");
                    }}
                  />
                  {/* Error message if any */}
                  {errors.lname && (
                    <span className="text-red-500 text-sm">
                      {errors.lname.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                {/* Email */}
                <div className="relative">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    E-Mail
                  </label>

                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2.5 pr-10 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400 ${errors.email ? "border-red-500" : ""}`}
                    placeholder="exemplo@dominio.com"
                    autoComplete="on"
                  />

                  {errors.email && (
                    <span className="text-red-500 text-sm">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                {/* PASSWORD */}
                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Palavra-Passe
                  </label>

                  <input
                    type="password"
                    id="password"
                    value="••••••••••••••••"
                    disabled
                    className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2.5 pr-10 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400 ${errors.password ? "border-red-500 dark:border-red-700" : ""}`}
                  />

                  {/* SVG Icon for password */}
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white absolute right-2 bottom-2 cursor-pointer"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    onClick={showPasswordChangeModal}
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                    />
                  </svg>
                  {errors.password && (
                    <span className="text-red-500 text-sm">
                      {errors.password.message}
                    </span>
                  )}
                </div>
                <div className="w-full">
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
                      value={userData?.phoneNumber}
                      onChange={handlePhoneChange}
                      inputProps={{
                        name: "phoneNumber",
                        id: "phoneNumber",
                        required: "O numero é obrigatorio",
                      }}
                      inputStyle={{
                        border: PhoneErrors
                          ? "1px solid red"
                          : "1px solid #d1d5db ",
                      }}
                    />
                    {PhoneErrors && (
                      <span className="text-red-500 text-sm">
                        {PhoneErrors}
                      </span>
                    )}
                  </div>
                </div>
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
                  min={formatDate(maxDate)} //
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
                </div>
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
                    value={watch("countryNif")}
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
                      message:
                        "Não atende ao número mínimo de caracteres exigido.",
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
                    value={watch("country")}
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
                      required: getValues("city")
                        ? false
                        : "Cidade é obrigatória",
                    })}
                    placeholder={getValues("city") || ""}
                    className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2.5 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400 ${errors.city ? "border-red-500 dark:border-red-700" : ""}`}
                  />
                  {cityError && (
                    <span className="text-red-500 text-sm">{cityError}</span>
                  )}
                </div>
              </div>

              {/* Save Changes Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  aria-label="Save Changes"
                  disabled={isLoadingChangeUserDetails}
                >
                  Guardar
                </button>
              </div>
            </form>
          </>
        )}
      </div>
      <PasswordModal
        isModalOpen={isModalPasswordOpen}
        onClose={showPasswordChangeModal}
      />
    </section>
  );
};

export default Perfil;
