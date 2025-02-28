import React, { useState } from "react";
import { useGetAllClassesQuery } from "@/state/api";

type DayOfWeek =
  | "Segunda"
  | "Terça"
  | "Quarta"
  | "Quinta"
  | "Sexta"
  | "Sábado"
  | "Domingo";

interface ClassType {
  name: string;
  color: string;
}

interface Class {
  classDate: string;
  startTime: string;
  endTime: string;
  location: string;
  classType: ClassType;
}

const daysOfWeek: DayOfWeek[] = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

const ScheduleTable: React.FC = () => {
  const { data, isLoading } = useGetAllClassesQuery();
  const today = new Date();
  const currentDayName = daysOfWeek[today.getDay()];
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(currentDayName);

  const getNextOccurrence = (day: DayOfWeek): Date => {
    const todayIndex = today.getDay();
    const selectedIndex = daysOfWeek.indexOf(day);
    const diff = (selectedIndex - todayIndex + 7) % 7 || 7;
    const nextDate = new Date(today);
    nextDate.setDate(
      today.getDate() + (todayIndex === selectedIndex ? 0 : diff)
    );
    return nextDate;
  };

  const calculateDuration = (startTime: string, endTime: string): string => {
    const start = new Date(`2025-01-01T${startTime}:00Z`);
    const end = new Date(`2025-01-01T${endTime}:00Z`);
    const diffInMillis =
      end < start
        ? end.getTime() - start.getTime() + 24 * 60 * 60 * 1000
        : end.getTime() - start.getTime();

    const hours = Math.floor(diffInMillis / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMillis % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  };

  const nextDate = getNextOccurrence(selectedDay);
  const formattedNextDate = nextDate.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const filteredClasses = (data || [])
    .filter(
      (cls: Class) =>
        new Date(cls.classDate).toDateString() === nextDate.toDateString()
    )
    .sort((a: Class, b: Class) => a.startTime.localeCompare(b.startTime));

  return (
    <section
      id="mapaAulas"
      className="w-full py-24 md:py-28 min-h-screen bg-background-color-light dark:bg-background-color"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 dark:text-white">
          Mapa de Aulas
        </h2>

        {/* Day Selection */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-2 text-sm md:text-base rounded-lg transition-colors duration-200 border border-black ${
                selectedDay === day
                  ? "bg-secondary-200 text-black font-bold border-black  dark:border-white"
                  : "text-gray-700 dark:text-white dark:hover:text-black hover:font-bold dark:hover:border-gray-600 dark:border-white hover:bg-secondary-200 hover:border-black dark:hover:bg-secondary-800"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Schedule Display */}
        <div className="mt-6">
          <p className="text-center text-lg font-semibold mb-4 dark:text-white">
            Aulas para{" "}
            <span className="text-secondary-600 dark:text-secondary-200">
              {selectedDay} ({formattedNextDate})
            </span>
          </p>

          {isLoading ? (
            <p className="text-center dark:text-white">Carregando...</p>
          ) : filteredClasses.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="grid gap-4 md:grid-cols-[auto_1fr_auto] md:gap-2">
                {filteredClasses.map((cls: Class, index: number) => (
                  <React.Fragment key={index}>
                    <div className="text-center md:text-right p-2 font-medium dark:text-white">
                      {cls.startTime}
                    </div>
                    <div
                      className="p-3 rounded-lg text-center"
                      style={{
                        backgroundColor: cls.classType.color || "#ffffff",
                        color: cls.classType.color ? "#ffffff" : "#000000",
                      }}
                    >
                      <div className="font-bold text-sm md:text-base">
                        {cls.classType.name}
                      </div>
                      <div className="text-xs md:text-sm">{cls.location}</div>
                    </div>
                    <div className="text-center p-2 font-medium dark:text-white">
                      {calculateDuration(cls.startTime, cls.endTime)}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400">
              Nenhuma aula para este dia
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ScheduleTable;
