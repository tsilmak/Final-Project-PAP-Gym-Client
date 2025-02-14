import LogoDark from "@/assets/LogoDark.png";
import LogoLight from "@/assets/Logo.png";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import "swiper/css";
import "swiper/css/navigation";
import PrimaryButton from "@/components/PrimaryButton";
import { motion } from "framer-motion";
import UnderlinedButton from "@/components/UnderlinedButton";
import { useAppSelector } from "@/app/redux";

const Home = () => {
  const user = useAppSelector((state) => state.auth.user);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  return (
    <section
      id="home"
      className={`h-full text-partial-black dark:text-white dark:bg-background-alt`}
    >
      {/* IMAGE AND MAIN HEADER */}
      <div className="flex flex-col items-center justify-center h-5/6   ">
        {/* MAIN HEADER */}
        <div className="flex flex-col items-center">
          {/* HEADINGS */}
          <motion.div
            className="flex justify-center w-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <img
              alt="Home Page Text"
              src={isDarkMode ? LogoLight : LogoDark}
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
            />
          </motion.div>

          {/* ACTIONS */}
          <motion.div
            className="mt-6 flex flex-col items-center md:flex-row gap-6 md:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <PrimaryButton
              label={user ? "Meu Perfil" : "Ver Planos"}
              navigateTo={user ? "perfil" : "inscricao"}
            />
            <UnderlinedButton
              children={"Saiba Mais"}
              path="/origem/#origem"
              isSection={false}
              className="text-base"
            />
          </motion.div>
        </div>
      </div>

      {/* Mapa de Aulas */}
      <div className="h-20 w-full bg-background-color-light dark:bg-background-color flex items-center justify-between mt-7 px-4 ">
        {/* Right Arrow */}
        <ArrowRightIcon className="h-6 w-6 sm:h-8 sm:w-8" />

        {/* Mapa de Aulas Button */}
        <UnderlinedButton
          children={"MAPA DE AULAS"}
          path="/mapaAulas"
          isSection={false}
        />

        {/* Left Arrow */}
        <ArrowLeftIcon className="h-6 w-6 sm:h-8 sm:w-8" />
      </div>
    </section>
  );
};

export default Home;
