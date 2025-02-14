import { GymPlanCard } from "@/components/GymPlanCards";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import GerirAssinaturaModal from "./GerirAssinaturaModal";
import { useEffect, useState } from "react";
import { useGetUserSignatureMutation } from "@/state/api";
import UserSidebar from "@/components/UserNavbar";

const Assinatura = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [getUserSignature, { data, isLoading }] = useGetUserSignatureMutation();

  const handleFetch = async () => {
    try {
      const result = await getUserSignature();
      console.log("Fetch result:", result);
    } catch (err) {
      console.error("Error fetching user signature:", err);
    }
  };

  useEffect(() => {
    // Trigger the mutation when the component mounts
    getUserSignature();
  }, [getUserSignature]);

  // Display the first signature temporarily
  const signature = data?.signatures[0];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section
      id="assinatura"
      className="py-28 bg-background-alt-light dark:bg-background-color text-primary-500 dark:text-white flex min-h-full"
    >
      {/* Sidebar */}
      <UserSidebar />

      {/* Main Content */}
      <div className="dark:bg-background-alt max-w-9xl p-8 shadow-lg rounded-lg mx-auto w-5/6 flex flex-col items-center">
        <h2 className="text-3xl font-semibold text-center mb-5">Assinatura</h2>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <GymPlanCard
            isSignatureProfilePage={true}
            isUserAuthenticated={true}
            name={signature?.gymPlan?.name || ""}
            price={signature?.gymPlan?.price || -1}
            highlightedPlan={true}
            features={signature?.gymPlan?.features || []}
            gymPlanId={signature?.gymPlanId || -1}
            startDate={new Date(
              signature?.startDate || ""
            ).toLocaleDateString()}
            endDate={
              signature?.endDate
                ? new Date(signature.endDate).toLocaleDateString()
                : "Não Aplicável"
            }
            isActive={signature?.isActive || false}
            openGerirAssinaturaModal={handleOpenModal}
          />
        )}
      </div>

      {/* Modal */}
      <GerirAssinaturaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        planName={signature?.gymPlan?.name || ""}
        planPrice={signature?.gymPlan?.price || 0}
        refetchSignature={handleFetch}
      />
    </section>
  );
};

export default Assinatura;
