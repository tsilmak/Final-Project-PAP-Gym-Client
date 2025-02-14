import PrimaryButton from "@/components/PrimaryButton";
import { useEffect, useState } from "react";
import { useVerifyPaymentQuery } from "@/state/api";
import { LoadingSpinner } from "@/components/LoadingSpinner";
// SVG icons as reusable components
const Icon = ({
  icon: IconComponent,
  text,
}: {
  icon: JSX.Element;
  color: string;
  text: string;
}) => (
  <div className="flex items-center">
    {IconComponent}
    <span className="ml-2 text-lg font-semibold text-white">{text}</span>
  </div>
);

// Define the types for the status content map
interface StatusContent {
  text: string;
  iconColor: string;
  icon: JSX.Element;
}

// Map status to content
const STATUS_CONTENT_MAP: Record<string, StatusContent> = {
  succeeded: {
    text: "O pagamento foi processado com sucesso",
    iconColor: "#30B130",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
  },
  processing: {
    text: "O seupagamento está a ser processado, pode sair desta página",
    iconColor: "#6D6E78",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
        />
      </svg>
    ),
  },
  requires_payment_method: {
    text: "O seu pagamento não foi processado, por favor tente novamente.",
    iconColor: "#DF1B41",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
        />
      </svg>
    ),
  },
  default: {
    text: "Ocorreu um erro desconhecido, por favor tente novamente.",
    iconColor: "#DF1B41",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
        />
      </svg>
    ),
  },
};

const CompletePage = () => {
  const [status, setStatus] = useState<string>("");
  const [intentId, setIntentId] = useState<string | undefined>();
  const params = new URLSearchParams(window.location.search);
  const paymentIntent = params.get("payment_intent") ?? "";
  const statusContent =
    STATUS_CONTENT_MAP[status] || STATUS_CONTENT_MAP.default;
  const { data, error, isLoading } = useVerifyPaymentQuery({ paymentIntent });

  // Update status based on the data response
  useEffect(() => {
    if (!paymentIntent) {
      return;
    }

    setIntentId(paymentIntent);

    // Only update the status when data is available
    if (data) {
      setStatus(data?.paymentStatus);
    }
  }, [data, paymentIntent]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background-alt-light dark:bg-background-alt">
        <LoadingSpinner />{" "}
        <p className="ml-2 text-lg font-semibold text-gray-700 dark:text-white">
          A carregar os detalhes do pagamento...
        </p>
      </div>
    );
  }

  if (error) {
    console.log(error);
    return (
      <div className="flex justify-center items-center h-screen bg-background-alt-light dark:bg-background-alt">
        <div className="max-w-lg mx-auto p-6  border border-red-500 rounded-lg shadow-lg  ">
          <div
            className="mb-6 p-6 rounded-lg shadow-lg dark:text-white"
            style={{ backgroundColor: statusContent.iconColor }}
          >
            <Icon
              icon={statusContent.icon}
              color={statusContent.iconColor}
              text={
                error &&
                typeof error === "object" &&
                "data" in error &&
                error.data &&
                typeof error.data === "object" &&
                "error" in error.data
                  ? (error.data as { error: string }).error
                  : "Ocorreu um erro desconhecido, por favor tente novamente mais tarde!"
              }
            />
          </div>
          <PrimaryButton
            label="Voltar aos pagamentos"
            navigateTo="perfil/pagamentos"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-color-light dark:bg-background-alt flex flex-col items-center">
      <div className="p-8 bg-background-alt-light dark:bg-background-color rounded-lg shadow-lg my-56">
        <div
          className="mb-6 p-6 rounded-lg shadow-lg dark:text-white"
          style={{ backgroundColor: statusContent.iconColor }}
        >
          <Icon
            icon={statusContent.icon}
            color={statusContent.iconColor}
            text={statusContent.text}
          />
        </div>
        {intentId && data && (
          <div className="bg-background-alt-light dark:bg-background-alt mb-6">
            <table className="min-w-full text-left table-auto">
              <tbody>
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-700 dark:text-secondary-200">
                    Identificador da Transação
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-white">
                    {intentId}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-700 dark:text-secondary-200">
                    Identificador Pessoal
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-white">
                    {data.paymentIdFromDb || "Não disponível"}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-700 dark:text-secondary-200">
                    Data e Hora do Pagamento:
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-white">
                    {data.paymentDate || "Não disponível"}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-700 dark:text-secondary-200">
                    Valor do pagamento:
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-white">
                    {data.paymentAmount
                      ? `${data.paymentAmount}€`
                      : "Não disponível"}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-700 dark:text-secondary-200">
                    Detalhes do produto:
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-white">
                    {data.paymentDescription}{" "}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-700 dark:text-secondary-200">
                    Email do cliente:
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-white">
                    {data.paymentUserEmail || "Não disponível"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <PrimaryButton
          label="Voltar aos pagamentos"
          navigateTo="perfil/pagamentos"
        />
      </div>
    </div>
  );
};

export default CompletePage;
