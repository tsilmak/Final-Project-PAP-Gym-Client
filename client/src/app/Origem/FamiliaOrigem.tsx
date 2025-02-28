import HText from "@/components/HText";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules"; // Import Autoplay
import image1 from "@/assets/TreinoFuncional.jpg";
import image2 from "@/assets/Yoga.jpg";
import image3 from "@/assets/BikeCycling.jpg";
import image4 from "@/assets/Zumba.jpg";
import image5 from "@/assets/Box.jpg";
import image6 from "@/assets/Step.jpg";

const modalityData = [
  {
    name: "Treino Funcional",
    description:
      "Treino funcional que pretende a reprodução de forma eficiente dos gestos motores específicos não só do Desporto como, também, da vida diária. Tem como princípio treinar o movimento e não o músculo isoladamente.",
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
      "Uma aula de 'indoor cycling' praticada numa bicicleta estacionária, na qual poderás treinar com resistência variada, adequando-a à tua aptidão física...",
    image: image3,
  },
  {
    name: "Zumba",
    description:
      "A Zumba é uma atividade dinâmica que combina dança e coreografia ao som de ritmos latinos associados a estímulos aeróbicos...",
    image: image4,
  },
  {
    name: "Box",
    description:
      "Sonhas em ter um saco de pancada para descarregar o stress do dia-a-dia? Aqui podes recorrer às aulas de grupo e aprender a lutar...",
    image: image5,
  },
  {
    name: "Step",
    description:
      "Quem nunca ouviu falar de aeróbica ou step? Desde os anos 80 que as aulas coreografadas cativaram inúmeros praticantes das aulas de grupo...",
    image: image6,
  },
];

const FamiliaOrigem = () => {
  return (
    <section
      id="familia"
      className={`py-16 text-partial-black dark:text-white dark:bg-background-alt`}
    >
      <div className="mx-auto w-5/6">
        <div className="mb-4">
          <HText children={"Mais do que um ginásio, uma família"} />
        </div>
        <p className="mb-6 ">
          Aqui, vais encontrar muito mais do que um espaço para treinar. Nós
          somos uma família dedicada ao teu bem-estar e sucesso.
        </p>

        <p className="mb-6 ">
          Na Sonder Hub, valorizamos a inclusão e o apoio mútuo. Cada membro é
          importante para nós, e trabalhamos juntos para criar um ambiente
          acolhedor...
        </p>

        <h4 className="text-2xl font-semibold mt-8 mb-2.5 text-center">
          Atividades e Eventos da Comunidade
        </h4>
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          pagination={{ clickable: true }}
          navigation={true}
          autoplay={{
            delay: 3000, // Time in milliseconds between slides
            disableOnInteraction: false, // Continue autoplay after user interactions
          }}
          modules={[Pagination, Navigation, Autoplay]} // Include Autoplay module
          className="w-full max-w-3xl mx-auto mb-8"
        >
          {modalityData.map((item, index) => (
            <SwiperSlide key={index} className="relative group">
              <div className="relative h-[60vh] w-full">
                <img
                  src={item.image}
                  alt={`Modalidade ${item.name}`}
                  className="object-cover w-full h-full rounded-2xl"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-t from-black to-transparent rounded-2xl">
                  <div className="text-white text-2xl font-bold mb-2">
                    {item.name}
                  </div>
                  <div className="text-white text-sm text-center">
                    {item.description}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FamiliaOrigem;
