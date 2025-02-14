import HText from "@/components/HText";
import React, { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent form from refreshing the page
    console.log("Form Data:", formData); // Log form data
  };

  return (
    <section
      id="contact"
      className="text-black py-10 px-10 lg:px-28  bg-background-color-light dark:bg-background-alt dark:text-white "
    >
      <hr className="my-12 h-0.5 border-t-0 bg-black dark:bg-secondary-200" />

      <div className="text-center mb-10 lg:mb-16 text-black dark:text-white">
        <HText>Alguma questão?</HText>
      </div>

      {/* Container for contact info and form */}
      <div className="lg:flex lg:space-x-20">
        {/* Contact Info */}
        <div className="text-center lg:text-left lg:w-1/2 mb-12 lg:mb-0">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-secondary-600 dark:text-secondary-400 mb-2">
              Morada
            </h3>
            <p>
              Rua Santos Lisboa, Nº 91 A<br />
              1501-135 São Sábados de Benfica
              <br />
              Lisboa
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-secondary-600 dark:text-secondary-400 mb-2">
              Contactos
            </h3>
            <p>+351 916 262 444 / +351 917 261 431</p>
            <p className="text-sm">(Chamada para a rede móvel nacional)</p>
          </div>

          <div className="mb-8">
            <p>+351 212 311 714</p>
            <p className="text-sm">(Chamada para a rede fixa nacional)</p>
          </div>

          <div>
            <p className="text-secondary-600 dark:text-secondary-400">
              E-mail:
              <a
                href="mailto:info@fitit.pt"
                className="text-black dark:text-white underline ml-2"
              >
                info@exemplo.pt
              </a>
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:w-5/12 bg-white dark:bg-background-color p-6 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit}>
            {/* Container to make email and name appear on the same line */}
            <div className="flex flex-col lg:flex-row lg:space-x-4 mb-5">
              <div className="w-full lg:w-1/2">
                <label htmlFor="name" className="block font-medium mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Seu nome"
                />
              </div>
              <div className="w-full lg:w-1/2 mb-3 lg:mb-0">
                <label htmlFor="email" className="block font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Seu email"
                />
              </div>
            </div>

            <div className="mb-5">
              <label htmlFor="phone" className="block font-medium mb-1">
                Telemóvel
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Seu número de telefone"
              />
            </div>

            <div className="mb-5">
              <label htmlFor="message" className="block font-medium mb-1">
                A sua dúvida
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Escreva sua dúvida"
                rows={3}
              />
            </div>

            <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors">
              Submeter
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
