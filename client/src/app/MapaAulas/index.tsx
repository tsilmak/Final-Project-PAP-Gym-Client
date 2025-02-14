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
  const { data } = useGetAllClassesQuery();
  const today = new Date();
  const currentDayName = daysOfWeek[today.getDay()];
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(currentDayName);

  const getNextOccurrence = (selectedDay: DayOfWeek): Date => {
    const todayIndex = today.getDay();
    const selectedIndex = daysOfWeek.indexOf(selectedDay);

    if (todayIndex === selectedIndex) {
      return today;
    }

    const diff = (selectedIndex - todayIndex + 7) % 7 || 7;
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + diff);

    return nextDate;
  };

  const nextDate = getNextOccurrence(selectedDay);

  const formattedNextDate = nextDate.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const calculateDuration = (startTime: string, endTime: string): string => {
    const start = new Date(`2025-01-01T${startTime}:00Z`);
    const end = new Date(`2025-01-01T${endTime}:00Z`);
    let diffInMillis = end.getTime() - start.getTime();
    if (diffInMillis < 0) diffInMillis += 24 * 60 * 60 * 1000;

    const hours = Math.floor(diffInMillis / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMillis % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  const filteredClasses = (data || [])
    .filter((cls: Class) => {
      const classDate = new Date(cls.classDate);
      return classDate.toDateString() === nextDate.toDateString();
    })
    .sort((a: Class, b: Class) => {
      const timeA = new Date(`2025-01-01T${a.startTime}:00Z`);
      const timeB = new Date(`2025-01-01T${b.startTime}:00Z`);
      return timeA.getTime() - timeB.getTime();
    });

  const handleDayChange = (day: DayOfWeek) => {
    setSelectedDay(day);
  };

  return (
    <section
      id="mapaAulas"
      className="w-full py-8 sm:py-16 h-full bg-background-color-light dark:bg-background-color "
    >
      <div className="container mx-auto px-4 mt-12">
        <div className="text-center">
          <h2 className="dark:text-white text-2xl sm:text-3xl font-bold mb-4 sm:mb-2">
            Mapa de Aulas
          </h2>
        </div>

        <div className="w-full flex flex-wrap justify-center items-center space-x-4 py-4">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              role="button"
              tabIndex={0}
              onClick={() => handleDayChange(day)}
              className={`px-3 py-2 sm:px-6 text-center border rounded focus:outline-none  ${
                selectedDay === day
                  ? "bg-secondary-200 text-white dark:text-partial-black"
                  : "bg-transparent hover:bg-secondary-200 dark:text-white hover:dark:text-partial-black"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="mt-4 ">
          <p className="text-center mb-4 text-lg font-semibold dark:text-white">
            Aulas para{" "}
            <span className="text-secondary-200 font-bold">{selectedDay}</span>{" "}
            ({formattedNextDate})
          </p>
          {filteredClasses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-center border-collapse dark:text-partial-black">
                <tbody>
                  {filteredClasses.map((cls: Class, index: number) => (
                    <tr key={index} className="bg-secondary-200">
                      <td className="w-1/12 p-2">{cls.startTime}</td>
                      <td className="p-3">
                        <div
                          className="p-2 rounded"
                          style={{
                            backgroundColor: cls.classType.color || "white",
                            color: cls.classType.color ? "white" : "black",
                          }}
                        >
                          <div className="font-bold">{cls.classType.name}</div>
                          <div>{cls.location}</div>
                        </div>
                      </td>
                      <td className="font-bold">
                        {calculateDuration(cls.startTime, cls.endTime)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center mt-4 dark:text-white">
              Nenhuma aula para este dia
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ScheduleTable;
