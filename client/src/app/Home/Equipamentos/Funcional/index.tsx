import { useState } from "react";
import { useGetFunctionalEquipmentQuery } from "@/state/api";

const Funcional = () => {
  const { data: functionalMachines } = useGetFunctionalEquipmentQuery();
  const [searchQuery, setSearchQuery] = useState("");
  console.log(functionalMachines);
  // Filter machines based on search query
  const filteredMachines =
    functionalMachines?.filter((machine) =>
      machine.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div className="min-h-screen dark:bg-background-color text-white py-28 bg-background-color-light">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-partial-black dark:text-white">
          Equipamento Funcional
        </h1>

        {/* Search input */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Pesquisar por máquina..."
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block p-2.5 dark:bg-background-alt dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMachines.map((machine) => (
            <div
              key={machine.id}
              className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 transform hover:scale-105 transition-transform duration-300"
            >
              {/* Image */}
              <div className="h-64 bg-white flex items-center justify-center p-4 rounded-lg shadow-lg">
                <img
                  src={machine.imageUrl}
                  alt={machine.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-3 dark:text-blue-400 text-blue-600">
                  {machine.name}
                </h2>
                <p className="dark:text-gray-400 text-black">
                  {machine.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Funcional;
