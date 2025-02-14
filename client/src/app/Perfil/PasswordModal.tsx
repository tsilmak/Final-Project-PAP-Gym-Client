import { useUserChangePasswordMutation } from "@/state/api";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { isApiErrorResponse } from "@/helpers/isApiErrorResponse";

// Define the props for the PasswordModal component
interface PasswordModalProps {
  isModalOpen: boolean;
  onClose: () => void;
}

// Define the structure of the form inputs
interface FormInputs {
  prevPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const PasswordModal: React.FC<PasswordModalProps> = ({
  isModalOpen,
  onClose,
}) => {
  // Initialize form handling with react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      prevPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Hook for changing the password
  const [changePassword, { isLoading, isSuccess }] =
    useUserChangePasswordMutation();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Effect to handle outside clicks and prevent body scrolling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const modal = document.getElementById("password-modal");
      if (modal && !modal.contains(target)) {
        onClose();
        setSuccessMsg(null);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset"; // Restore scrolling when modal is closed
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset"; // Clean up on unmount
    };
  }, [isModalOpen, onClose]);

  // Submit handler for form submission
  const onSubmit = async (data: FormInputs) => {
    setErrorMsg(null); // Clear previous error messages
    setSuccessMsg(null); // Clear previous success messages

    try {
      await changePassword(data).unwrap(); // Send the password change request
      reset(); // Reset form fields on success
      setSuccessMsg("A Palavra-Passe foi alterada com sucesso!"); // Set success message
    } catch (error: unknown) {
      if (isApiErrorResponse(error)) {
        // Handle specific API error messages
        const errorMessage =
          error.data?.message ||
          "Erro desconhecido, pedimos imensa desculpa! Tente novamente";
        setErrorMsg(errorMessage);
      } else {
        // Handle unexpected errors
        setErrorMsg(
          "Ocorreu um erro inesperado. Pedimos imensa desculpa! Tente Novamente"
        );
      }
    }
  };

  return (
    <div
      className={`${isModalOpen ? "" : "hidden"} fixed inset-0 z-50 bg-black bg-opacity-50`}
      aria-hidden={!isModalOpen}
    >
      <div
        className="relative p-4 w-full max-w-md max-h-full mx-auto mt-20"
        id="password-modal"
      >
        <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Mudar a Palavra-Passe
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={onClose}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Previous Password Input */}
              <div>
                <label
                  htmlFor="prevPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Palavra-Passe anterior
                </label>
                <input
                  type="password"
                  id="prevPassword"
                  {...register("prevPassword", {
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
                  className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white ${errors.prevPassword ? "border-red-500" : ""}`}
                />
                {errors.prevPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.prevPassword.message}
                  </p>
                )}
              </div>

              {/* New Password Input */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Nova Palavra-Passe
                </label>
                <input
                  type="password"
                  id="newPassword"
                  {...register("newPassword", {
                    required: "Nova palavra-passe é obrigatória",
                    validate: (value) =>
                      value !== watch("prevPassword") ||
                      "A nova palavra-passe não pode ser a mesma que a anterior.",
                  })}
                  placeholder="••••••••"
                  className={`bg-gray-50 border ${errors.newPassword ? "border-red-500" : "border-gray-300"} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white`}
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirme a nova Palavra-Passe
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  {...register("confirmPassword", {
                    required: "Por favor, confirme sua nova palavra-passe",
                    validate: (value) =>
                      value === watch("newPassword") ||
                      "A palavras-passe não coincide",
                  })}
                  placeholder="••••••••"
                  className={`bg-gray-50 border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                disabled={isLoading}
              >
                {isLoading ? "A Processar..." : "Guardar"}
              </button>
            </form>

            {/* Error and Success Messages */}
            {errorMsg && (
              <p className="text-red-500 text-sm mt-2">{errorMsg}</p>
            )}
            {isSuccess && successMsg && (
              <p className="text-green-500 text-sm mt-2">{successMsg}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
