import HText from "@/components/HText";
import maquinaCardio01 from "@/assets/cardio-maquina01.jpg";
import maquinaMusculacao01 from "@/assets/musculacao-maquina01.png";
import equipamentoFuncional01 from "@/assets/funcional-equipamento01.jpg";
import { Link } from "react-router-dom"; // Import Link

const MaquinasOrigem = () => {
  return (
    <>
      <section
        id="maquinas"
        className={` text-partial-black dark:text-white dark:bg-background-alt`}
      >
        {/* Secção: Máquinas Premium */}
        <div className="mx-auto w-5/6">
          <div className="mb-4">
            <HText children={"Máquinas Premium"} />
          </div>
          <p className="mb-6">
            Na Sonder Hub, tens à tua disposição máquinas de alta qualidade,
            ideais para todos os níveis de treino, desde os iniciantes até os
            mais experientes. As nossas máquinas premium, importadas diretamente
            dos Estados Unidos, asseguram-te um desempenho excecional e uma
            experiência de treino superior.
          </p>
          {/* Secção: Tecnologia Utilizada */}
          <h4 className="text-2xl font-semibold mt-8 mb-1 text-center">
            Tecnologia de Ponta
          </h4>
          <p className="mb-6">
            As máquinas da Sonder Hub são equipadas com a mais recente
            tecnologia, incluindo monitores de desempenho, conectividade
            Bluetooth e programas de treino personalizáveis. Estas
            funcionalidades permitem-te monitorizar o teu progresso e adaptar os
            treinos às tuas necessidades. Com tecnologia de ponta e design
            ergonómico, cada máquina é projetada para maximizar o teu potencial
            e proporcionar um treino agradável e produtivo.
          </p>
          {/* Lista de Máquinas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Exemplo de Máquina 1 */}
            <Link
              to="/equipamentos/cardio"
              className="transform transition-all duration-300 hover:bg-gray-300 dark:hover:bg-gray-700 hover:scale-105 border border-transparent hover:border-gray-400 dark:hover:border-gray-600 rounded-lg"
            >
              <div className="bg-neutral-200 dark:bg-gray-800 flex flex-col h-full">
                <img
                  src={maquinaCardio01}
                  alt="Máquina 1"
                  className="w-full h-full object-cover rounded-t-lg flex-1"
                />
                <div className="p-4">
                  <h4 className="text-xl font-semibold mt-2">
                    Máquina de Cardio
                  </h4>
                  <p>
                    Perfeita para treinos de resistência e queima de calorias.
                  </p>
                </div>
              </div>
            </Link>

            {/* Exemplo de Máquina 2 */}
            <Link
              to="/equipamentos/musculacao"
              className="transform transition-all duration-300 hover:bg-gray-300 dark:hover:bg-gray-700 hover:scale-105 border border-transparent hover:border-gray-400 dark:hover:border-gray-600 rounded-lg"
            >
              <div className="bg-neutral-200 dark:bg-gray-800 flex flex-col h-full">
                <img
                  src={maquinaMusculacao01}
                  alt="Máquina 2"
                  className="w-full h-full object-cover rounded-t-lg flex-1"
                />
                <div className="p-4">
                  <h4 className="text-xl font-semibold mt-2">
                    Máquina de Musculação
                  </h4>
                  <p>Ideal para aumentar a força e tonificar os músculos.</p>
                </div>
              </div>
            </Link>

            {/* Exemplo de Máquina 3 */}
            <Link
              to="/equipamentos/funcional"
              className="transform transition-all duration-300 hover:bg-gray-300 dark:hover:bg-gray-700 hover:scale-105 border border-transparent hover:border-gray-400 dark:hover:border-gray-600 rounded-lg"
            >
              <div className="bg-neutral-200 dark:bg-gray-800 flex flex-col h-full">
                <img
                  src={equipamentoFuncional01}
                  alt="Máquina 3"
                  className="w-full h-full object-cover rounded-t-lg flex-1"
                />
                <div className="p-4">
                  <h4 className="text-xl font-semibold mt-2">
                    Equipamento Funcional
                  </h4>
                  <p>
                    Versátil para treinos de alta intensidade e condicionamento
                    físico.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default MaquinasOrigem;
