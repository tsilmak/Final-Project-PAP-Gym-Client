import HText from "@/components/HText";
import useMediaQuery from "@/hooks/useMediaQuery";
import React, { useState } from "react";

type Props = {
  onBack: () => void; // Function to handle going back
  onSubmit: () => void; // Function to call on successful submission
};

const Questions = ({ onBack, onSubmit }: Props) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");

  // State to track user answers
  const [answers, setAnswers] = useState({
    medicalRestriction: "",
    chestPain: "",
    medication: "",
    under16: "",
  });

  // State to manage error messages
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all questions have been answered
    if (Object.values(answers).some((answer) => answer === "")) {
      setError("Por favor, responda todas as perguntas.");
      return;
    }

    onSubmit();
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Ensure full-screen height */}
      <div
        className={`p-8 bg-background-alt-light dark:bg-background-alt rounded-lg shadow-md  ${
          isAboveMediumScreens ? "w-1/2" : "max-w-xl"
        } h-full`}
      >
        <div className="text-center mb-6 px-4 sm:px-8">
          <HText>
            3/3 Questionário de Saúde
            <br />
            <span className="text-secondary-400">Está quase!</span>
          </HText>
        </div>
        <button
          onClick={onBack}
          className="mb-6 dark:text-white hover:underline"
        >
          &larr; Voltar
        </button>

        {/* Health Questions */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p>
              Algum médico o proibiu de praticar atividades físicas e/ou
              desportivas devido a algum fator de risco que possa representar um
              perigo para a sua saúde? *
            </p>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="medicalRestriction"
                  value="nao"
                  className="form-radio text-primary-600 dark:text-primary-400"
                  onChange={handleChange}
                />
                <span className="ml-2">NÃO</span>
              </label>
            </div>
          </div>
          <div>
            <p>Sente dores no peito ou tonturas ao fazer exercício? *</p>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="chestPain"
                  value="nao"
                  className="form-radio text-primary-600 dark:text-primary-400"
                  onChange={handleChange}
                />
                <span className="ml-2">NÃO</span>
              </label>
            </div>
          </div>
          <div>
            <p>
              Está a tomar alguma medicação ou conhece algum outro motivo que
              seja incompatível com a prática de atividade física e/ou
              desportiva? *
            </p>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="medication"
                  value="nao"
                  className="form-radio text-primary-600 dark:text-primary-400"
                  onChange={handleChange}
                />
                <span className="ml-2">NÃO</span>
              </label>
            </div>
          </div>
          <div>
            <p>É menor de 16 anos? *</p>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="under16"
                  value="nao"
                  className="form-radio text-primary-600 dark:text-primary-400"
                  onChange={handleChange}
                />
                <span className="ml-2">NÃO</span>
              </label>
            </div>
          </div>
          {error && <p className="text-red-500">{error}</p>}{" "}
          {/* Error message */}
          <button
            type="submit"
            className="mt-6 w-full bg-secondary-400 text-partial-black py-2 rounded hover:bg-secondary-200"
          >
            Submeter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Questions;
