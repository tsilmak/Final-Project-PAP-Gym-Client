import { setSelectedGymPlan } from "@/state";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Define the Feature interface
export interface Feature {
  feature: string;
  included?: boolean;
}

// Define the props for GymPlanCard
interface GymPlanCardPropsBase {
  gymPlanId: number;
  name: string;
  price: number;
  highlightedPlan: boolean;
  features: Feature[];
  isUserAuthenticated: boolean;
  isSignatureProfilePage: boolean;
}

// Define the props when the user is authenticated
interface GymPlanCardPropsWhenUserIsAuthenticated extends GymPlanCardPropsBase {
  isUserAuthenticated: true; // Set this as true
  isActive: boolean;
  startDate: string;
  endDate: string;
  openGerirAssinaturaModal: () => void;
}

// Define the props when the user is not authenticated
interface GymPlanCardPropsWhenUserIsNotAuthenticated
  extends GymPlanCardPropsBase {
  isUserAuthenticated: false;
  // Not allowed when not authenticated
  isActive?: never;
  startDate?: never;
  endDate?: never;
  openGerirAssinaturaModal?: never;
}

// Union type for GymPlanCardProps
type GymPlanCardProps =
  | GymPlanCardPropsWhenUserIsAuthenticated
  | GymPlanCardPropsWhenUserIsNotAuthenticated;

// GymPlanCard component
export const GymPlanCard: React.FC<GymPlanCardProps> = ({
  name,
  price,
  highlightedPlan,
  features,
  gymPlanId,
  isUserAuthenticated,
  isActive,
  openGerirAssinaturaModal,
  startDate,
  endDate,
  isSignatureProfilePage,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const maxHeightCardClass = isUserAuthenticated
    ? "h-[700px] sm:h-[800px] md:h-[750px] lg:h-[750px]"
    : "h-[500px] sm:h-[550px] md:h-[650px] lg:h-[700px]";

  const maxHeightFeaturesClass = isUserAuthenticated
    ? "max-h-[200px] sm:max-h-[350px] md:max-h-[300px] lg:max-h-[300px]"
    : "max-h-[250px] sm:max-h-[300px] md:max-h-[400px] lg:max-h-[450px]";

  const maxWidthCardClass = isUserAuthenticated
    ? "sm:w-[400px] md:w-[450px] lg:w-[500px] xl:w-[600px]"
    : "sm:w-[280px] md:w-[340px] lg:w-[350px] xl:w-[400px]";

  return (
    <div
      className={`p-4 sm:p-5 border rounded-lg mx-4 sm:mx-6 md:mx-8 mt-5 sm:mt-8 flex flex-col w-full  justify-between ${maxWidthCardClass} ${
        highlightedPlan
          ? "bg-background-alt-light transform scale-105 dark:bg-background-alt dark:border-secondary-500"
          : "bg-background-alt-light dark:bg-background-alt border-white"
      } ${maxHeightCardClass}`}
    >
      <div>
        {/* Plan Name */}
        <h5
          className={`text-lg sm:text-xl font-bold mb-2 sm:mb-3 ${
            highlightedPlan
              ? "text-secondary-600 dark:text-secondary-400"
              : "text-black dark:text-white"
          }`}
        >
          {name}
        </h5>

        {/* Price */}
        <div className="flex items-baseline text-gray-900">
          <span
            className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${
              highlightedPlan
                ? "text-secondary-600 dark:text-secondary-500"
                : "text-black dark:text-white"
            }`}
          >
            {price}
          </span>
          <span
            className={`text-2xl sm:text-3xl font-semibold ${
              highlightedPlan
                ? "text-secondary-600 dark:text-secondary-500"
                : "text-black dark:text-white"
            }`}
          >
            €
          </span>
          <span className="text-base sm:text-xl font-normal ms-1.5 text-black dark:text-white">
            /mês
          </span>
        </div>

        {/* Features List */}
        <ul
          role="list"
          className={`my-4 sm:my-6 space-y-2 sm:space-y-4 overflow-y-auto ${maxHeightFeaturesClass}`}
        >
          {/* Iterate through the features array */}
          {features.map((feature: Feature, index: number) => (
            <li
              key={index}
              className={`flex items-center ${
                !feature.included && !isSignatureProfilePage
                  ? "line-through text-gray-400 dark:text-gray-400" // Strike-through only if not on Signature Profile Page
                  : "text-black dark:text-white" // Normal style otherwise
              }`}
            >
              {/* Icon for each feature */}
              <svg
                className={`w-4 sm:w-5 h-4 sm:h-5 me-2 sm:me-3 ${
                  isSignatureProfilePage || feature.included
                    ? "text-green-500" // Green check if on Signature Profile Page or included
                    : "text-gray-400" // Gray check otherwise
                }`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              {/* Display the feature name */}
              <span className="text-sm sm:text-base">{feature.feature}</span>
            </li>
          ))}
        </ul>

        {isUserAuthenticated && (
          <div className="bg-white dark:bg-background-color rounded-lg shadow-md p-6 ">
            <h3 className="text-xl font-bold mb-4 text-gray-700 dark:text-white">
              Detalhes da Assinatura
            </h3>

            <div className="flex justify-between mb-4">
              <span className="font-semibold text-gray-700 dark:text-white">
                Data de Inicio:
              </span>
              <span className="text-gray-900 dark:text-secondary-400">
                {startDate}
              </span>
            </div>

            <div className="flex justify-between mb-4">
              <span className="font-semibold text-gray-700 dark:text-white">
                Data Fim:
              </span>
              <span className="text-gray-900 dark:text-secondary-400 ">
                {endDate}
              </span>
            </div>

            <div className="flex justify-between mb-1">
              <span className="font-semibold text-gray-700 dark:text-white">
                Estado Atual:
              </span>
              <span
                className={`font-bold ${isActive ? "text-green-700 dark:text-green-400" : "text-red-600"}`}
              >
                {isActive ? "Ativo" : "Inativo"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Button at the bottom */}
      {isUserAuthenticated ? (
        <button
          type="button"
          className={`w-full py-2.5 text-partial-black font-semibold rounded-md mt-3 sm:mt-4 ${
            highlightedPlan
              ? "bg-secondary-400 hover:bg-secondary-500"
              : "bg-secondary-200 hover:bg-secondary-400"
          } focus:outline-none focus:ring-4 focus:ring-opacity-50`}
          aria-label={`Gerir o Plano ${name}`}
          onClick={openGerirAssinaturaModal}
        >
          Gerir
        </button>
      ) : (
        <button
          type="button"
          className={`w-full py-2.5 text-partial-black font-semibold rounded-md mt-3 sm:mt-4 ${
            highlightedPlan
              ? "bg-secondary-400 hover:bg-secondary-500"
              : "bg-secondary-200 hover:bg-secondary-400"
          } focus:outline-none focus:ring-4 focus:ring-opacity-50`}
          aria-label={`Escolher ${name}`}
          onClick={() => {
            // Dispatch the action to set the selected gym plan
            dispatch(
              setSelectedGymPlan({
                gymPlanId,
                name,
                price,
              })
            );

            // Navigate to the specified route
            navigate("/inscricao"); // Use a string for the path
          }}
        >
          Escolher Plano
        </button>
      )}
    </div>
  );
};
