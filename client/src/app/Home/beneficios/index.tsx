import HText from "@/components/HText";
import { BenefitType } from "@/types";
import {
  AcademicCapIcon,
  HomeModernIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Benefit from "./Benefit";

const benefits: Array<BenefitType> = [
  {
    icon: <HomeModernIcon className="h-6 w-6" />,
    title: "Máquinas Premium",
    description:
      "Na Sonder Hub, podes confiar nas nossas máquinas para todos os teus treinos, desde os mais básicos aos mais avançados. As nossas máquinas são de calibre premium, importadas dos Estados Unidos, garantindo-te a melhor qualidade e desempenho.",
    link: "/origem/#maquinas",
  },
  {
    icon: <UserGroupIcon className="h-6 w-6" />,
    title: "Mais do que um ginásio, uma família",
    description:
      "Aqui, vais encontrar muito mais do que um espaço para treinar. Aqui, nós somos uma família dedicada ao teu bem-estar e sucesso. Junta-te a nós e sente a diferença!",
    link: "/origem/#familia",
  },
  {
    icon: <AcademicCapIcon className="h-6 w-6" />,
    title: "Assitido por profissionais",
    description:
      "Acreditamos que os nossos profissionais podem ajudar-te a alcançar resultados mais rápidos. Por isso, temos especialistas para te acompanhar nesta jornada. Se tiveres alguma dúvida, não hesites em perguntar!",
    link: "/origem/#profissionais",
  },
];
const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const Benefits = () => {
  return (
    <section
      id="beneficios"
      className="mx-auto py-6 text-black dark:bg-background-alt dark:text-white "
    >
      <motion.div>
        {/* HEADER */}
        <motion.div
          className="mx-auto w-5/6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <HText children={"Mais do que um ginásio"} />
          <p className="my-3">
            Descobre um espaço onde o bem-estar vai além do físico. No nosso
            ginásio, cada treino é uma jornada de autodescoberta e superação.
            Vem transformar o corpo e a mente connosco!
          </p>
        </motion.div>
        {/* BENEFITS */}
        <motion.div
          className="mt-5 items-center justify-between gap-8 md:flex mx-auto w-5/6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
        >
          {benefits.map((benefit: BenefitType) => (
            <Benefit
              key={benefit.title}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
              link={benefit.link}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Benefits;
