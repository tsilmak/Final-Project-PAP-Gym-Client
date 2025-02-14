import useMediaQuery from "@/hooks/useMediaQuery";
import HText from "@/components/HText";
import PrimaryButton from "@/components/PrimaryButton";

export const FreeVouncher = () => {
  const isAboveMediaScreens = useMediaQuery("(min-width:1060px)");

  return (
    <section id="freevouncher" className=" dark:text-white bg-background-color-light dark:bg-background-color">
      <div className=" py-5  w-100  w-5/6  mx-auto">
        {/* FORM */}
        <div>
          {/* TITLE */}
          <div className="mt-12">
            <div>
              <HText>
                GOSTARIAS DE VIR CÁ EXPERIMENTAR?
                <br />
                <span className="text-secondary-400">GRATUITAMENTE?</span>
              </HText>
            </div>
          </div>
          {/* DESCRIPTION */}
          <div>
            <p className="my-5">
              Sem fidelização, sem compromissos, preenche este formulário com as
              tuas informações de contacto para receberes um vouncher de treino
              gratuito!
            </p>
          </div>
          {/* SUBMIT */}
          <div
            className={`flex ${!isAboveMediaScreens ? "flex-col gap-4" : "justify-between items-center gap-4"}`}
          >
            {/* EMAIL */}
            <div
              className={`${!isAboveMediaScreens ? "flex flex-col w-full" : "w-1/2 flex"}`}
            >
              <div className="flex w-full">
                <span className="inline-flex items-center px-3 text-sm drop-shadow border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-white dark:border-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  id="email"
                  className="text-black rounded-none rounded-e-lg bg-gray-50 border border-gray-300 focus:ring-secondary-200 focus:border-secondary-200 block flex-1 min-w-0 w-full text-sm p-2.5"
                  placeholder="E-mail"
                  style={{ fontSize: "16px" }} // Add this line
                />
              </div>
            </div>

            {/* TELEMÓVEL */}
            <div
              className={`${!isAboveMediaScreens ? "flex flex-col w-full" : "w-1/2 flex"}`}
            >
              <div className="flex w-full">
                <span className="inline-flex items-center px-3 text-sm drop-shadow border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-white dark:border-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  id="phone"
                  className="text-black rounded-none rounded-e-lg bg-gray-50 border border-gray-300 focus:ring-secondary-200 focus:border-secondary-200 block flex-1 min-w-0 w-full text-sm p-2.5"
                  placeholder="Telemóvel"
                  style={{ fontSize: "16px" }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 my-4">
            <input
              id="remember"
              type="checkbox"
              value=""
              className="mx-3 w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 "
              required
            />
            <p>
              Autorizo receber comunicações como publicidade, promoções e
              notícias.
            </p>
          </div>
          <div className="flex items-center gap-2 ">
            <input
              id="remember"
              type="checkbox"
              value=""
              className="mx-3 w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 "
              required
            />
            <p>
              Declaro que li, compreendo e aceito a{" "}
              <a
                href="#"
                className="font-semibold text-secondary-500 dark:text-secondary-200 underline"
              >
                Política de Privacidade
              </a>{" "}
              e os{" "}
              <a
                href="#"
                className="font-semibold text-secondary-500 dark:text-secondary-200 underline"
              >
                Termos &amp; Condições
              </a>
            </p>
            {isAboveMediaScreens && (
              <div className="ml-auto">
                <PrimaryButton label="Sumbeter" navigateTo={""} />
              </div>
            )}
          </div>
          {!isAboveMediaScreens && (
            <div className="flex justify-end mt-5">
              <PrimaryButton label="Sumbeter" navigateTo={""} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
