import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { ModalityType } from "@/types";

type ModalityProps = {
  modalityData: Array<ModalityType>;
};

const Modality = ({ modalityData }: ModalityProps) => {
  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={30}
      loop={true}
      pagination={{ clickable: true }}
      navigation={true}
      modules={[Pagination, Navigation]}
      className="w-full max-w-3xl mx-auto"
    >
      {modalityData.map((item, index) => (
        <SwiperSlide key={index} className="relative group">
          <div className="swiper-slide-inner relative h-[60vh] w-full">
            <img
              src={item.image}
              alt={`Modalidade ${item.name}`}
              className="object-cover w-full h-full rounded-2xl"
            />
            <div className="swiper-slide-contents absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-t from-black to-transparent rounded-2xl">
              <div className="elementor-slide-heading text-white text-2xl font-bold mb-2">
                {item.name}
              </div>
              <div className="elementor-slide-description text-white text-sm text-center">
                {item.description}
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Modality;
