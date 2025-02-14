import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import PrimaryButton from "@/components/PrimaryButton";
import { Payments, useGetUserPaymentsMutation } from "@/state/api";
import { useNavigate } from "react-router-dom";
import UserSidebar from "@/components/UserNavbar";

const Pagamentos = () => {
  const [getUserPayments, { data, isLoading, isError }] =
    useGetUserPaymentsMutation();
  const payments = Array.isArray(data) ? data : [];
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mesFiltro, setMesFiltro] = useState<string>("");
  const [anoFiltro, setAnoFiltro] = useState<string>("");
  const [statusFiltro, setStatusFiltro] = useState<string>("");
  const [paymentDetails, setPaymentDetails] = useState<Payments | null>(null);

  useEffect(() => {
    getUserPayments();
  }, [getUserPayments]);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.paymentId
      .toString()
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesMonth =
      !mesFiltro || new Date(payment.date).getMonth() + 1 === Number(mesFiltro);
    const matchesYear =
      !anoFiltro ||
      new Date(payment.date).getFullYear().toString() === anoFiltro;
    const matchesStatus =
      !statusFiltro || payment.paymentStatusName === statusFiltro;
    return matchesSearch && matchesMonth && matchesYear && matchesStatus;
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleViewDetails = (payment: Payments) => {
    setPaymentDetails(payment);
  };

  const closeDetails = () => {
    setPaymentDetails(null);
  };

  const handlePay = (paymentDetails: Payments) => {
    if (paymentDetails) {
      navigate(`/checkout/`, {
        state: {
          amountToPay: paymentDetails.amount,
          paymentId: paymentDetails.paymentId,
          isSubscription: false,
        },
      });
    } else {
      console.error("Payment token is missing in the result:", paymentDetails);
    }
  };

  return (
    <section className="min-h-full py-28 bg-background-alt-light dark:bg-background-color text-primary-500 dark:text-white flex ">
      {/* Sidebar */}
      <UserSidebar />

      {/* Main Content */}
      <div className="  dark:bg-background-alt max-w-9xl p-8 shadow-lg rounded-lg mx-auto w-5/6  flex flex-col items-center">
        <div className="w-full mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-5">
            Pagamentos
          </h2>

          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="Pesquisar por ID de pagamento"
              value={searchQuery}
              onChange={handleSearch}
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2.5 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400"
            />

            <div className="flex flex-col md:flex-row gap-4">
              <select
                value={mesFiltro}
                onChange={(e) => setMesFiltro(e.target.value)}
                className="w-full md:w-1/2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400"
              >
                <option value="">Filtrar por mês</option>
                {[...Array(12)].map((_, index) => (
                  <option key={index} value={index + 1}>
                    {new Date(0, index).toLocaleString("pt-BR", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>

              <select
                value={anoFiltro}
                onChange={(e) => setAnoFiltro(e.target.value)}
                className="w-full md:w-1/2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400"
              >
                <option value="">Filtrar por ano</option>
                {[2025, 2024].map((ano) => (
                  <option key={ano} value={ano}>
                    {ano}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              className="w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 dark:bg-background-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400"
            >
              <option value="">Filtrar por status</option>
              <option value="Pago">Pago</option>
              <option value="Pendente">Pendente</option>
              <option value="Reembolsado">Reembolsado</option>
            </select>
          </div>

          {/* Payments List */}
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="w-full">
              {filteredPayments.length > 0 || !isError ? (
                <ul className="space-y-4">
                  {filteredPayments.map((payment: Payments) => (
                    <li
                      key={payment.paymentId}
                      className="border rounded-lg p-4 space-y-3 md:space-y-0 md:flex md:justify-between md:items-center dark:bg-background-color"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-base md:text-lg">
                          ID: {payment.paymentId}
                        </span>
                        <span className="text-sm text-gray-500">
                          Data: {new Date(payment.date).toLocaleDateString()}
                        </span>
                      </div>

                      <span
                        className={`${
                          payment.paymentStatusName === "Pago"
                            ? "text-green-500"
                            : payment.paymentStatusName === "Reembolsado"
                              ? "text-blue-500"
                              : payment.paymentStatusName === "Pendente"
                                ? "text-yellow-300"
                                : "text-gray-500"
                        } font-semibold text-sm md:text-base`}
                      >
                        {payment.paymentStatusName}
                      </span>

                      <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center">
                        <span className="text-lg md:text-xl font-semibold">
                          {payment.amount.toFixed(2)}€
                        </span>
                        <div onClick={() => handleViewDetails(payment)}>
                          <PrimaryButton
                            label="Ver detalhes"
                            navigateTo={null}
                          />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-lg md:text-xl text-gray-500">
                  Nenhum pagamento encontrado
                </p>
              )}
            </div>
          )}

          {/* Payment Details Modal */}
          {paymentDetails && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
              <div className="w-full max-w-[500px] bg-white dark:bg-background-alt rounded-lg p-4 md:p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl md:text-2xl font-semibold mb-4">
                    Detalhes do Pagamento
                  </h3>
                  <button
                    onClick={closeDetails}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-2">
                  <p>
                    <strong>ID:</strong> {paymentDetails.paymentId}
                  </p>
                  <p>
                    <strong>Data:</strong>{" "}
                    {new Date(paymentDetails.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Valor:</strong> {paymentDetails.amount.toFixed(2)}€
                  </p>
                  <p>
                    <strong>Estado:</strong> {paymentDetails.paymentStatusName}
                  </p>
                  <p>
                    <strong>Detalhes da compra:</strong> {paymentDetails.title}
                  </p>
                </div>

                {paymentDetails.paymentStatusName !== "Pago" &&
                  paymentDetails.paymentStatusName !== "Reembolsado" && (
                    <div className="flex justify-end mt-6">
                      <button
                        onClick={() => handlePay(paymentDetails)}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                      >
                        Pagar
                      </button>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Pagamentos;
