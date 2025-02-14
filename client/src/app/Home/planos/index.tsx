import { GymPlanCard } from "@/components/GymPlanCards";
import HText from "@/components/HText";
import { GymPlan } from "@/state/api";

// Static Gym Plans
const plans: GymPlan[] = [
  {
    gymPlanId: 5,
    name: "Plano Premium",
    price: 64,
    highlightedPlan: false,
    features: [
      { feature: "Livre Trânsito" },
      { feature: "Supervisão / acompanhamento de treinos" },
      { feature: "Avaliação e prescrição de treino individualizado" },
      { feature: "Aulas de grupo" },
      { feature: "Reserva de aulas com 23 horas de antecedência" },
      { feature: "Aulas Bike ICG Lifefitness" },
      { feature: "Aconselhamento nutricional" },
      { feature: "Aulas exclusivas" },
      { feature: "BOX (Crosstraining)" },
    ],
  },
  {
    gymPlanId: 4,
    name: "Plano Completo",
    price: 44,
    highlightedPlan: true,
    features: [
      { feature: "Livre Trânsito" },
      { feature: "Supervisão / acompanhamento de treino" },
      { feature: "Avaliação e prescrição de treino individualizado" },
      { feature: "Aulas de grupo" },
      { feature: "Reserva de aulas com 23 horas de antecedência" },
      { feature: "Aulas Bike ICG Lifefitness" },
      { feature: "Aconselhamento nutricional" },
    ],
  },
  {
    gymPlanId: 3,
    name: "Plano Livre Acesso",
    price: 30,
    highlightedPlan: false,
    features: [
      { feature: "Livre Trânsito" },
      { feature: "Supervisão / acompanhamento de treino" },
      { feature: "Avaliação e prescrição de treino individualizado" },
    ],
  },
];

const GymPlans = () => {
  return (
    <section
      id="gymPlans"
      className=" bg-background-color-light py-16 text-black dark:bg-background-color dark:text-white"
    >
      <div className="text-center mb-6">
        <HText>
          Tabela de Preços
          <br />
          <span className="text-secondary-600 dark:text-secondary-400">
            PLANOS DE TREINO
          </span>
        </HText>
      </div>

      <div className="flex flex-wrap lg:flex-nowrap justify-center mx-auto px-20">
        {plans.map((plan, index) => (
          <GymPlanCard
            key={index}
            {...plan}
            gymPlanId={plan.gymPlanId}
            features={plan.features.map((f) => ({
              feature: f.feature,
              included: true,
            }))}
            isUserAuthenticated={false}
            isSignatureProfilePage={false}
          />
        ))}
      </div>
    </section>
  );
};

export default GymPlans;
