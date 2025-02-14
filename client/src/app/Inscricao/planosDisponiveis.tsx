import { useState } from "react";
import { GymPlanCard } from "@/components/GymPlanCards";
import HText from "@/components/HText";
import { useGetGymPlansQuery } from "@/state/api";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const PlanosGinasio = () => {
  const { data: gymPlans = [], isLoading, isError } = useGetGymPlansQuery();
  const [currentPage, setCurrentPage] = useState(0);

  const plansPerPage = 3;

  const handlePrevious = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if ((currentPage + 1) * plansPerPage < gymPlans.length)
      setCurrentPage(currentPage + 1);
  };

  const plansToShow = gymPlans.slice(
    currentPage * plansPerPage,
    (currentPage + 1) * plansPerPage
  );

  const isFirstPage = currentPage === 0;
  const isLastPage = (currentPage + 1) * plansPerPage >= gymPlans.length;

  const allUniqueFeatures = Array.from(
    new Set(
      gymPlans?.flatMap((plan) => plan.features.map((f) => f.feature)) || []
    )
  );

  const plansWithFeatures = plansToShow.map((plan) => ({
    ...plan,
    features: allUniqueFeatures.map((feature) => ({
      feature,
      included: plan.features.some((f) => f.feature === feature),
    })),
  }));
  console.log(plansWithFeatures);

  return (
    <div>
      <div className="text-center mb-6 px-4 sm:px-8">
        <HText>
          1/3 Escolhe o teu plano ideal
          <br />
          <span className="text-secondary-400">
            Encontra a melhor opção para ti!
          </span>
        </HText>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[700px]">
          <LoadingSpinner />
        </div>
      ) : isError ? (
        <div>Error loading gym plans.</div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="flex flex-wrap justify-center gap-6 mx-auto px-4 sm:px-8">
            {plansWithFeatures.map((plan, index) => (
              <GymPlanCard
                key={index}
                {...plan}
                isUserAuthenticated={false}
                highlightedPlan={false}
                isSignatureProfilePage={false}
              />
            ))}
          </div>

          <div className="flex items-center justify-center space-x-6 mt-4">
            {!isFirstPage && (
              <button
                className="bg-background-color text-white dark:text-black dark:bg-white p-2 rounded-full dark:hover:bg-gray-600"
                onClick={handlePrevious}
              >
                &lt;
              </button>
            )}
            {!isLastPage && (
              <button
                className="bg-background-color text-white dark:text-black dark:bg-white p-2 rounded-full dark:hover:bg-gray-600"
                onClick={handleNext}
              >
                &gt;
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanosGinasio;
