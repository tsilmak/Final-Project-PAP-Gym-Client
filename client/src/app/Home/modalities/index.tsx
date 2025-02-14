import HText from "@/components/HText";
import { motion } from "framer-motion";
import { ModalityType } from "@/types";
import Modality from "./Modality";
import image1 from "@/assets/TreinoFuncional.jpg";
import image2 from "@/assets/Yoga.jpg";
import image3 from "@/assets/BikeCycling.jpg";
import image4 from "@/assets/Zumba.jpg";
import image5 from "@/assets/Box.jpg";
import image6 from "@/assets/Step.jpg";

const modalityData: Array<ModalityType> = [
  {
    name: "Treino Funcional",
    description:
      " Treino funcional que pretende a reprodução de forma eficiente dos gestos motores específicos não só do Desporto como, também, da vida diária. Tem como princípio treinar o movimento e não o músculo isoladamente.",
    image: image1,
  },
  {
    name: "Yoga",
    description:
      "Vem unir a tua mente, corpo e espírito, através da prática de prosturas físicas, técnicas de respiração e meditação.",
    image: image2,
  },
  {
    name: "Bike Cycling",
    description:
      "Uma aula de “indoor cycling” praticada numa bicicleta estacionária, na qual poderás treinar com resistência variada, adequando-a à tua aptidão física. A aula apresenta uma estrutura diversa, com músicas poderosas e motivantes, aliada à última geração de equipamentos “intelligent fitness”. Uma ótima opção para quem pretenda reduzir massa gorda e melhorar resistência cardiovascular.",
    image: image3,
  },
  {
    name: "Zumba",
    description:
      "A Zumba é uma atividade dinâmica que combina dança e coreografia ao som de ritmos latinos associados a estímulos aeróbicos, desenvolvendo especialmente a resistência e a coordenação. Fica em forma e tonifica o corpo de forma alegre e descontraída.",
    image: image4,
  },
  {
    name: "Box",
    description:
      "Sonhas em ter um saco de pancada para descarregar o stress do dia-a-dia? Aqui podes recorrer às aulas de grupo e aprender a lutar e/ou descarregar o teu stress. Para iniciados e avançados.",
    image: image5,
  },
  {
    name: "Step",
    description:
      "Quem nunca ouviu falar de aeróbica ou step? Desde os anos 80 que as aulas coreografadas cativaram inúmeros praticantes das aulas de grupo. No FIT IT pretendemos dar continuidade a este tipo de aulas, ritmadas e divertidas. Vem treinar a memória, a coordenação e a resistência.",
    image: image6,
  },
];

const Modalities = () => {
  return (
    <section
      id="modalities"
      className="py-16 text-black dark:bg-background-alt dark:text-white"
    >
      <motion.div
        className="mx-auto w-5/6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        variants={{
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 },
        }}
      >
        <div>
          <HText>Modalidades</HText>
          <p className="my-2">
            Proporcionamos diversas modalidades que não só tornam o teu treino
            mais dinâmico e divertido, como também garantem um desenvolvimento
            físico completo e equilibrado. Temos aulas de alta intensidade para
            queimares calorias rapidamente e sessões de yoga para a tua
            flexibilidade e relaxamento. Temos algo para todos os gostos e
            objetivos.
            <br />
            SAIBA MAIS
          </p>
        </div>
      </motion.div>
      <div className="mt-10  mx-8">
        <Modality modalityData={modalityData} />
      </div>
    </section>
  );
};

export default Modalities;
