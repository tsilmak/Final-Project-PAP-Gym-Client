import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUserLoginMutation } from "@/state/api";
import { isApiErrorResponse } from "@/helpers/isApiErrorResponse";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useDispatch } from "react-redux";
import { setCredetials } from "@/state/authSlice";

type UserFormLogin = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();

  const [userLogin, { isLoading }] = useUserLoginMutation();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormLogin>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Always go to the top of the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle form submission
  const onSubmit = async (data: UserFormLogin) => {
    try {
      const result = await userLogin(data).unwrap(); // Unwrap to handle errors properly
      console.log(result);
      dispatch(
        setCredetials({ accessToken: result.accessToken, user: result.user })
      );

      navigate("/perfil");
    } catch (error: unknown) {
      if (isApiErrorResponse(error)) {
        const errorMessage = `${error.data?.message || "Erro desconhecido, pedimos imensa desculpa!"}`;
        setErrorMsg(errorMessage);
      } else {
        setErrorMsg(
          "Ocorreu um erro inesperado ao iniciar a sessão. Pedimos imensa desculpa!"
        );
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen dark:bg-background-color">
      <div className="w-full max-w-md p-6 bg-background-alt-light dark:bg-background-alt rounded-lg shadow-lg mx-10">
        <h2 className="text-2xl font-semibold text-center text-black dark:text-white">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {/* Email Field */}
          <div className="flex flex-col mb-4">
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
              className={` border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2.5 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400 ${errors.email ? "border-red-500 dark:border-red-700" : ""}`}
              placeholder="exemplo@dominio.com"
              maxLength={100}
              required
              autoComplete="on"
            />
            {errors.email && (
              <span className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div className="flex flex-col mb-2">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Palavra passe
            </label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Insira a sua palavra-passe",
                minLength: {
                  value: 8,
                  message: "Não atende ao número mínimo de caracteres exigido.",
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
              required
              autoComplete="on"
            />
            {errors.password && (
              <span className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-secondary-400 hover:bg-secondary-500 text-black inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-medium focus:ring-4 transition-colors duration-300 ease-in-out"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-full flex justify-between">
                  <span>A Iniciar sessão...</span>
                  <LoadingSpinner />
                </div>
              ) : (
                "Iniciar sessão"
              )}
            </button>
          </div>

          {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
