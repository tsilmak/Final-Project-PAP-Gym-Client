import HText from "@/components/HText";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Photos
import OriginPhoto01 from "@/assets/origin-main-photo01.jpg";
import OriginPhoto02 from "@/assets/origin-main-photo02.png";
import GymCardioArea01 from "@/assets/GymAreaPhotos/gym-cardio-area-01.png";
import GymCardioArea02 from "@/assets/GymAreaPhotos/gym-cardio-area-02.jpg";
import GymMusculationArea01 from "@/assets/GymAreaPhotos/gym-musculation-area-01.jpg";
import GymInteriorArea01 from "@/assets/GymAreaPhotos/gym-interior-area-01.jpg";
import GymFunctionalArea01 from "@/assets/GymAreaPhotos/gym-functional-area-01.jpg";
import GymFunctionalArea02 from "@/assets/GymAreaPhotos/gym-functional-area-02.jpg";

const FirstSectionGymSpacePhotos = [
  { image: GymCardioArea01 },
  { image: GymFunctionalArea01 },
  { image: OriginPhoto01 },
  { image: OriginPhoto02 },
];
const SecondSectionGymSpacePhotos = [
  { image: GymInteriorArea01 },
  { image: GymMusculationArea01 },
  { image: GymCardioArea02 },
  { image: GymFunctionalArea02 },
];

const OrigemMain = () => {
  return (
    <section
      id="origem"
      className="py-28 dark:text-white dark:bg-background-alt"
    >
      {/* Title Section */}
      <div className="ml-5 flex justify-center mb-12">
        <HText>Conhece melhor o GymHub</HText>
      </div>

      {/* First Section: Text + Swiper */}
      <div className="flex flex-col-reverse lg:flex-row items-center justify-center mx-auto w-5/6">
        {/* Text Section */}
        <div className="lg:w-1/2 lg:pr-8">
          <HText>
            <span className="text-secondary-500 dark:text-secondary-400">
              A nossa missão
            </span>
          </HText>
          <p className="mt-4 text-sm lg:text-base">
            No <strong>GymHub</strong>, acreditamos que o caminho para um estilo
            de vida saudável começa com pequenos passos. Somos mais do que um
            simples ginásio; somos a tua comunidade de fitness, focada em
            proporcionar treinos personalizados e motivação contínua para
            alcançar os teus objetivos.
          </p>
        </div>

        {/* Image Section */}
        <div className="w-full lg:w-1/2 sm:mb-6">
          <Swiper
            loop={true}
            pagination={{ clickable: true }}
            navigation={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            modules={[Pagination, Navigation, Autoplay]}
            className="w-full h-[450px]"
          >
            {FirstSectionGymSpacePhotos.map((item, index) => (
              <SwiperSlide key={index} className="relative group">
                <img
                  src={item.image}
                  alt={`Imagem ${index}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <hr className="my-12 border-black dark:border-white" />

      {/* Second Section: Swiper + Text */}
      <div className="flex flex-col lg:flex-row items-center justify-center mx-auto w-5/6">
        {/* Image Section */}
        <div className="w-full lg:w-1/2 sm:mb-6">
          <Swiper
            loop={true}
            pagination={{ clickable: true }}
            navigation={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            modules={[Pagination, Navigation, Autoplay]}
            className="w-full h-[450px]"
          >
            {SecondSectionGymSpacePhotos.map((item, index) => (
              <SwiperSlide key={index} className="relative group">
                <img
                  src={item.image}
                  alt={`Imagem ${index}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Text Section */}
        <div className="lg:w-1/2 lg:pl-8">
          <HText>
            <span className="text-secondary-500 dark:text-secondary-400">
              A experiência no GymHub
            </span>
          </HText>
          <p className="mt-4 text-sm lg:text-base">
            Com instalações modernas e uma equipa de profissionais dedicados, o{" "}
            <strong>GymHub</strong> oferece uma ampla variedade de aulas e
            equipamentos de alta qualidade, ideais para todos os níveis de
            experiência, desde iniciantes até atletas avançados.
          </p>
          <ul className="list-disc list-inside mt-4 text-sm lg:text-base">
            <li>Profissionais especializados com elevada experiência;</li>
            <li>Metodologia ajustada às necessidades de cada sócio;</li>
            <li>Espaço amplo (2500m²) com 4 estúdios e Box de CrossFit.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default OrigemMain;
