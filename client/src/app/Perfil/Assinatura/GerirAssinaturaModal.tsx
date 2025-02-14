import React, { useState } from "react";
import { Modal } from "flowbite-react";
import {
  GymPlan,
  useChangeUserSignatureGymPlanMutation,
  useGetGymPlansQuery,
} from "@/state/api";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planPrice: number;
  refetchSignature: () => void;
}

const getChangePlanDescription = (
  currentPlanName: string,
  gymPlans: GymPlan[] | undefined,
  onPlanSelect: (plan: GymPlan) => void,
  isLoadingGymPlans: boolean,
  errorLoadingGymPlans: boolean,
  refetch: () => void
) => {
  const availablePlans =
    gymPlans?.filter((plan) => plan.name !== currentPlanName) || [];

  return (
    <div className="text-center">
      <h1 className="text-xl mb-1">{`Atualmente estás com o "${currentPlanName}".`}</h1>
      <p>Escolhe o plano para qual desejas mudar:</p>
      {isLoadingGymPlans ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary-400"></div>
          <p className="ml-4 text-gray-600">A carregar planos...</p>
        </div>
      ) : errorLoadingGymPlans ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-red-600 mb-2">
            Erro ao carregar planos
          </h2>
          <p className="text-red-500 mb-4">
            Não foi possível carregar os planos disponíveis. Por favor, tente
            novamente.
          </p>
          <button
            onClick={refetch}
            className="bg-secondary-400 text-white px-4 py-2 rounded-lg hover:bg-secondary-500 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {availablePlans.map((plan) => (
            <li
              key={plan.gymPlanId}
              className="bg-background-color border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => onPlanSelect(plan)}
            >
              <div className="font-semibold text-lg">{plan.name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Helper to display the plan change
const getModalPlanChange = (
  currentPlan: string,
  currentPlanPrice: number,
  planChange: GymPlan
) => {
  const newPrice = planChange.price;

  const isPriceIncrease = newPrice > currentPlanPrice;
  const priceDifference = Math.abs(newPrice - currentPlanPrice);

  return (
    <div className="text-center p-6 space-y-4">
      <div className="bg-background-color dark:bg-background-color rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Plano Atual
        </h2>
        <p className="text-xl font-bold text-secondary-500">{currentPlan}</p>
        <p className="text-lg text-gray-600 dark:text-secondary-200">
          €{currentPlanPrice.toFixed(2)}/mês
        </p>
      </div>

      <div
        className={`rounded-lg p-4 dark:bg-background-color ${
          isPriceIncrease
            ? "bg-red-50 border-2 border-red-200"
            : "bg-green-50 border-2 border-green-200"
        }`}
      >
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Novo Plano
        </h2>
        <p className="text-xl font-bold text-secondary-500">
          {planChange.name}
        </p>
        <p className="text-lg text-gray-600 dark:text-secondary-200">
          {newPrice.toFixed(2)}€/mês
        </p>

        {isPriceIncrease ? (
          <div className="mt-2 text-green-500 font-semibold">
            Custo adicional: +€{priceDifference.toFixed(2)}/mês
            <p className="text-sm text-green-300 italic">
              💡 Será criado um pagamento que terá de fazer na sua aba
              Pagamentos
            </p>
          </div>
        ) : (
          <div className="mt-2 text-red-400 font-semibold">
            Downgrade: Não será cobrado valor adicional
            <p className="text-sm text-green-200 italic">
              💡 O valor mensal entrará em vigor na próxima fatura
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to display the cancel plan description
const getCancelPlanDescription = () => {
  return (
    <>
      <p>Ao clicares em 'Confirmar', a tua assinatura será cancelada.</p>
      <p>No entanto, ela irá permanecer ativa até ao final do período atual.</p>
      <p>Não será debitado mais nenhum pagamento verificar se tem data fim</p>
    </>
  );
};

// Main modal component
const GerirAssinaturaModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  planName,
  planPrice,
  refetchSignature,
}) => {
  const {
    data: gymPlans,
    isLoading: isLoadingGymPlans,
    error: errorLoadingGymPlans,
    refetch,
  } = useGetGymPlansQuery();
  const [updateSignatureGymPlan] = useChangeUserSignatureGymPlanMutation();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<GymPlan | null>(null);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState<boolean>(false);

  // Snackbar state
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarIsError, setSnackbarIsError] = useState<boolean>(false);

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  const handlePlanSelect = (plan: GymPlan) => {
    setSelectedPlan(plan);
  };

  const handleNextStep = () => {
    if (selectedOption) {
      onClose();
      setIsSecondModalOpen(true);
    }
  };

  const closeSecondModal = () => {
    setIsSecondModalOpen(false);
    setSelectedOption(null);
    setSelectedPlan(null);
  };

  const handleChangeGymPlan = async (selectedPlan: GymPlan) => {
    try {
      // Call the mutation to update the gym plan
      const response = await updateSignatureGymPlan({
        gymPlanId: selectedPlan.gymPlanId,
      });
      console.log(response);

      if (response?.data) {
        // Show success message in Snackbar
        setSnackbarMessage("Plano atualizado com sucesso!");
        setSnackbarIsError(false); // Reset error state
        setSnackbarOpen(true);
        // Hide Snackbar after 3 seconds
        setTimeout(() => setSnackbarOpen(false), 3000);
        refetchSignature();
        closeSecondModal();
      } else {
        // Show error message in Snackbar
        setSnackbarMessage(
          "Erro ao atualizar o plano. " +
            ("data" in (response?.error || {})
              ? (
                  (response.error as FetchBaseQueryError).data as {
                    message?: string;
                  }
                )?.message || "Erro desconhecido"
              : "")
        );
        setSnackbarIsError(true);
        setSnackbarOpen(true);
        // Hide Snackbar after 3 seconds
        setTimeout(() => setSnackbarOpen(false), 3000);
        closeSecondModal();
      }
    } catch (error) {
      // Handle any errors that occurred during the mutation
      setSnackbarMessage("Erro ao atualizar o plano.");
      setSnackbarIsError(true);
      setSnackbarOpen(true);
      // Hide Snackbar after 3 seconds
      setTimeout(() => setSnackbarOpen(false), 3000);
      closeSecondModal();
    }
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };
  return (
    <>
      {snackbarOpen && (
        <div
          className={`z-40 ml-5 fixed left-0 bottom-4 p-4 rounded-lg shadow-lg flex items-center justify-between space-x-4 ${
            snackbarIsError ? "bg-red-500" : "bg-green-500"
          }`}
        >
          <span>{snackbarMessage}</span>
          <button
            className="bg-transparent text-white hover:text-gray-200"
            onClick={closeSnackbar}
          >
            ✕
          </button>
        </div>
      )}

      {/* First Modal */}
      <Modal
        show={isOpen}
        onClose={onClose}
        className="items-center justify-center bg-gray-800 bg-opacity-50 fixed z-50"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Modal.Header id="modal-title" className="bg-background-alt">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Gerir Assinatura
          </h3>
        </Modal.Header>
        <Modal.Body id="modal-description" className="bg-background-alt">
          <p className="text-gray-500 dark:text-white mb-4">
            Seleciona uma das opções:
          </p>
          <ul className="space-y-4 mb-4">
            <li>
              <input
                type="radio"
                id="option-2"
                name="option-1"
                value="option-2"
                className="hidden peer"
                onChange={() => handleOptionChange("option-2")}
              />
              <label
                htmlFor="option-2"
                className="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:peer-checked:text-secondary-500 peer-checked:border-secondary-400 peer-checked:text-secondary-400 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:bg-partial-black dark:hover:bg-primary-300"
              >
                <div className="block">
                  <div className="w-full text-lg font-semibold">
                    Mudar Assinatura
                  </div>
                  <div className="w-full text-gray-500 dark:text-gray-400">
                    Clica aqui para mudares os detalhes da tua assinatura
                  </div>
                </div>
              </label>
            </li>
            <li>
              <input
                type="radio"
                id="option-1-3"
                name="option-1"
                value="option-1-3"
                className="hidden peer"
                onChange={() => handleOptionChange("option-1-3")}
              />
              <label
                htmlFor="option-1-3"
                className="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:peer-checked:text-secondary-500 peer-checked:border-secondary-400 peer-checked:text-secondary-400 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:bg-partial-black dark:hover:bg-primary-300"
              >
                <div className="block">
                  <div className="w-full text-lg font-semibold">
                    Cancelar Assinatura
                  </div>
                  <div className="w-full text-gray-500 dark:text-gray-400">
                    Clica aqui para cancelares a tua assinatura
                  </div>
                </div>
              </label>
            </li>
          </ul>
          <button
            onClick={handleNextStep}
            disabled={!selectedOption}
            className={`inline-flex w-full justify-center rounded-md text-partial-black px-10 py-2 ${
              selectedOption
                ? "bg-secondary-400 hover:bg-secondary-500"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Próximo passo
          </button>
        </Modal.Body>
      </Modal>

      {/* Second Modal */}
      <Modal
        show={isSecondModalOpen}
        onClose={closeSecondModal}
        className="items-center justify-center bg-gray-800 bg-opacity-50 fixed z-50"
        aria-labelledby="second-modal-title"
        aria-describedby="second-modal-description"
      >
        <Modal.Header id="second-modal-title" className="bg-background-alt">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedOption === "option-2"
              ? "Mudar Assinatura"
              : "Cancelar Assinatura"}
          </h3>
        </Modal.Header>
        <Modal.Body id="second-modal-description" className="bg-background-alt">
          <div className="text-gray-500 dark:text-white mb-4">
            {selectedOption === "option-2"
              ? selectedPlan
                ? getModalPlanChange(planName, planPrice, selectedPlan)
                : getChangePlanDescription(
                    planName,
                    gymPlans,
                    handlePlanSelect,
                    isLoadingGymPlans,
                    !!errorLoadingGymPlans,
                    refetch
                  )
              : getCancelPlanDescription()}
          </div>
          {selectedPlan && (
            <div>
              <button
                onClick={() => handleChangeGymPlan(selectedPlan)}
                className={`inline-flex w-full justify-center rounded-md text-partial-black px-10 py-2 bg-secondary-400 hover:bg-secondary-500`}
              >
                Confirmar
              </button>
              <button
                onClick={closeSecondModal}
                className={`mt-5 inline-flex w-full justify-center rounded-md text-partial-black px-10 py-2 bg-red-600 hover:bg-red-700`}
              >
                Cancelar
              </button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default GerirAssinaturaModal;
