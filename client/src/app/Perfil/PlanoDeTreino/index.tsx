import { useEffect, useState } from "react";
import {
  Calendar,
  Target,
  Minus,
  Plus,
  EllipsisVerticalIcon,
  X,
  HelpCircle,
} from "lucide-react";
import UserSidebar from "@/components/UserNavbar";
import { motion } from "framer-motion";
import {
  useGetAllExercisesQuery,
  useGetUserWorkoutMutation,
} from "@/state/api";

type Set = {
  reps: number;
  weight: number;
};

type Exercise = {
  exerciseId: string;
  name: string;
  imageUrl: string;
  sets: Set[];
  targetMuscle: string;
  exerciseType: string;
};

type Workout = {
  id: string;
  madeBy: string;
  date: string;
  title: string;
  exercises: Exercise[];
  targetMuscles: string[];
};

type SetError = {
  reps: boolean;
  weight: boolean;
};

type ExerciseErrors = {
  sets: SetError[];
};

const PlanoTreino = () => {
  const { data: exercises } = useGetAllExercisesQuery();
  const [getUserWorkout, { data: dataUserWorkout }] =
    useGetUserWorkoutMutation();

  useEffect(() => {
    getUserWorkout();
  }, [getUserWorkout]);

  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [minimized, setMinimized] = useState<boolean>(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [showWorkoutInProgressModal, setShowWorkoutInProgressModal] =
    useState(false);
  const [workoutToStart, setWorkoutToStart] = useState<Workout | null>(null);
  const [exerciseErrors, setExerciseErrors] = useState<ExerciseErrors[]>([]);
  const [showExercisesModal, setShowExercisesModal] = useState<boolean>(false);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [equipmentFilter, setEquipmentFilter] = useState<string>("");

  const [showSetInfoModal, setShowSetInfoModal] = useState<{
    show: boolean;
    setIdx: number;
    exerciseIdx: number;
  }>({
    show: false,
    setIdx: 0,
    exerciseIdx: 0,
  });
  const [showExerciseInfoModal, setShowExerciseInfoModal] = useState<{
    show: boolean;
    exerciseIdx: number;
  }>({ show: false, exerciseIdx: 0 });

  const createEmptyWorkout = () => {
    const emptyWorkout: Workout = {
      id: Date.now().toString(),
      madeBy: "User",
      date: new Date().toISOString().split("T")[0],
      title: "New Workout",
      exercises: [],
      targetMuscles: [],
    };

    if (activeWorkout) {
      setWorkoutToStart(emptyWorkout);
      setShowWorkoutInProgressModal(true);
    } else {
      startWorkout(emptyWorkout);
    }
  };

  const startWorkout = (workout: Workout) => {
    setActiveWorkout(workout);
    setTimer(0);
    const id = window.setInterval(() => setTimer((prev) => prev + 1), 60000);
    setIntervalId(id);
    setWorkoutToStart(null);
    setExerciseErrors([]);
  };

  const validateWorkout = (workout: Workout): boolean => {
    const newErrors: ExerciseErrors[] = workout.exercises.map((exercise) => ({
      sets: exercise.sets.map((set) => ({
        reps: set.reps <= 0,
        weight: set.weight <= 0,
      })),
    }));

    setExerciseErrors(newErrors);
    return !newErrors.some((exercise) =>
      exercise.sets.some((set) => set.reps || set.weight)
    );
  };

  const finishWorkout = () => {
    if (!activeWorkout || activeWorkout.exercises.length === 0) return;

    const isValid = validateWorkout(activeWorkout);
    if (!isValid) return;

    const summary = {
      duration: timer,
      totalVolume: activeWorkout.exercises.reduce(
        (total, exercise) =>
          total +
          exercise.sets.reduce(
            (setTotal, set) => setTotal + set.reps * set.weight,
            0
          ),
        0
      ),
      totalSets: activeWorkout.exercises.reduce(
        (total, exercise) => total + exercise.sets.length,
        0
      ),
      exercises: activeWorkout.exercises.map((exercise) => ({
        name: exercise.name,
        sets: exercise.sets,
        totalVolume: exercise.sets.reduce(
          (total, set) => total + set.reps * set.weight,
          0
        ),
      })),
    };

    console.log("Completed Workout:", {
      ...activeWorkout,
      summary,
      completedAt: new Date().toISOString(),
    });

    if (intervalId) window.clearInterval(intervalId);
    alert("Workout completed successfully!");
    setActiveWorkout(null);
  };

  const discardWorkout = () => {
    if (intervalId) window.clearInterval(intervalId);
    setActiveWorkout(null);
    setShowWorkoutInProgressModal(false);
    setExerciseErrors([]);
  };

  const handleRemoveExercise = (exerciseIdx: number) => {
    if (activeWorkout) {
      const updatedExercises = activeWorkout.exercises.filter(
        (_, index) => index !== exerciseIdx
      );
      setActiveWorkout({ ...activeWorkout, exercises: updatedExercises });
      setShowExerciseInfoModal({ show: false, exerciseIdx: 0 });
    }
  };

  const toggleMinimize = () => {
    setMinimized((prev) => !prev);
    if (!minimized && intervalId) {
      window.clearInterval(intervalId);
      setIntervalId(null);
    } else if (minimized) {
      const id = window.setInterval(() => setTimer((prev) => prev + 1), 60000);
      setIntervalId(id);
    }
  };

  const addNewExercise = (newExercises: Exercise[]) => {
    if (activeWorkout) {
      const exercisesWithEmptySets = newExercises.map((exercise) => ({
        ...exercise,
        sets: [{ reps: 0, weight: 0 }],
      }));
      setActiveWorkout({
        ...activeWorkout,
        exercises: [...activeWorkout.exercises, ...exercisesWithEmptySets],
      });
      setExerciseErrors([
        ...exerciseErrors,
        ...newExercises.map(() => ({ sets: [{ reps: false, weight: false }] })),
      ]);
    }
  };

  const addSetToExercise = (exerciseIdx: number) => {
    if (activeWorkout) {
      const updatedExercises = [...activeWorkout.exercises];
      updatedExercises[exerciseIdx].sets.push({ reps: 0, weight: 0 });
      setActiveWorkout({ ...activeWorkout, exercises: updatedExercises });
      setExerciseErrors((prev) => {
        const newErrors = [...prev];
        newErrors[exerciseIdx].sets.push({ reps: false, weight: false });
        return newErrors;
      });
    }
  };

  const handleRemoveSet = (setIdx: number, exerciseIdx: number) => {
    if (activeWorkout && activeWorkout.exercises[exerciseIdx].sets.length > 1) {
      const updatedExercises = [...activeWorkout.exercises];
      updatedExercises[exerciseIdx].sets = updatedExercises[
        exerciseIdx
      ].sets.filter((_, index) => index !== setIdx);
      setActiveWorkout({ ...activeWorkout, exercises: updatedExercises });
      setExerciseErrors((prev) => {
        const newErrors = [...prev];
        newErrors[exerciseIdx].sets = newErrors[exerciseIdx].sets.filter(
          (_, i) => i !== setIdx
        );
        return newErrors;
      });
      setShowSetInfoModal({ show: false, setIdx: 0, exerciseIdx: 0 });
    } else {
      alert("Não é possível remover o último set do exercício!");
    }
  };

  const updateSetValues = (
    exerciseIdx: number,
    setIdx: number,
    field: "reps" | "weight",
    value: number
  ) => {
    if (activeWorkout) {
      const updatedExercises = activeWorkout.exercises.map((exercise, eIdx) => {
        if (eIdx === exerciseIdx) {
          const updatedSets = exercise.sets.map((set, sIdx) =>
            sIdx === setIdx ? { ...set, [field]: value } : set
          );
          return { ...exercise, sets: updatedSets };
        }
        return exercise;
      });
      setActiveWorkout({ ...activeWorkout, exercises: updatedExercises });

      const updatedErrors = [...exerciseErrors];
      if (updatedErrors[exerciseIdx]?.sets?.[setIdx]) {
        updatedErrors[exerciseIdx].sets[setIdx][field] = value <= 0;
        setExerciseErrors(updatedErrors);
      }
    }
  };

  interface WorkoutData {
    workoutPlanId: string;
    createdAt: string;
    name: string;
    madeByUser: { fname: string; lname: string };
    exercises: {
      exercise: {
        exerciseId: string;
        name: string;
        imageUrl: string;
        targetMuscle: string;
        exerciseType: string;
      };
      sets: number;
      reps: number;
      weight: number;
    }[];
  }

  const adaptWorkoutData = (workout: WorkoutData): Workout | null => {
    if (!workout || !workout.exercises || !workout.madeByUser) return null;

    try {
      const adaptedWorkout: Workout = {
        id: workout.workoutPlanId,
        date: workout.createdAt,
        title: workout.name,
        madeBy: `${workout.madeByUser.fname} ${workout.madeByUser.lname}`,
        exercises: workout.exercises.map((exerciseData) => ({
          exerciseId: exerciseData.exercise.exerciseId,
          name: exerciseData.exercise.name,
          imageUrl: exerciseData.exercise.imageUrl,
          sets: Array.from({ length: exerciseData.sets }, () => ({
            reps: exerciseData.reps || 0,
            weight: exerciseData.weight || 0,
          })),
          targetMuscle: exerciseData.exercise.targetMuscle,
          exerciseType: exerciseData.exercise.exerciseType,
        })),
        targetMuscles: [],
      };
      return adaptedWorkout;
    } catch (error) {
      console.error("Error adapting workout data:", error);
      return null;
    }
  };

  const handleStartWorkoutClick = (workoutData: WorkoutData) => {
    const adaptedWorkout = adaptWorkoutData(workoutData);
    if (adaptedWorkout) {
      if (activeWorkout) {
        setWorkoutToStart(adaptedWorkout);
        setShowWorkoutInProgressModal(true);
      } else {
        startWorkout(adaptedWorkout);
      }
    }
  };

  const filteredExercises = exercises?.filter((exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.targetMuscle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEquipment =
      !equipmentFilter || exercise.exerciseType === equipmentFilter;
    return matchesSearch && matchesEquipment;
  });

  return (
    <section className="min-h-full py-28 bg-background-alt-light dark:bg-background-color text-primary-500 dark:text-white flex">
      {!activeWorkout || (activeWorkout && minimized) ? <UserSidebar /> : null}

      {/* WORKOUT MODAL */}
      {activeWorkout && !minimized && (
        <div className="w-full fixed inset-0 bg-background-color flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {showExerciseInfoModal.show && (
              <div
                className="w-full fixed inset-0 bg-black bg-opacity-70 flex items-end justify-center p-6 z-50"
                role="dialog"
                aria-labelledby="exercise-modal-title"
              >
                <div className="bg-neutral-900 w-full max-w-2xl rounded-t-lg p-4">
                  <div
                    className="bg-gray-800 p-4 text-xl font-bold text-white rounded-lg"
                    id="exercise-modal-title"
                  >
                    Opções do Exercício
                  </div>
                  <div className="space-y-4 mt-4">
                    <button
                      className="w-full flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                      onClick={() => console.log("Informação do exercício")}
                    >
                      <HelpCircle /> Dicas e Como Fazer
                    </button>
                    <button
                      className="w-full flex items-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
                      onClick={() =>
                        handleRemoveExercise(showExerciseInfoModal.exerciseIdx)
                      }
                    >
                      <X /> Remover Exercício
                    </button>
                  </div>
                  <button
                    className="mt-6 w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                    onClick={() =>
                      setShowExerciseInfoModal({ show: false, exerciseIdx: 0 })
                    }
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {showSetInfoModal.show && (
              <div
                className="w-full fixed inset-0 bg-black bg-opacity-70 flex items-end justify-center p-6 z-50"
                role="dialog"
                aria-labelledby="set-modal-title"
              >
                <div className="bg-neutral-900 w-full max-w-2xl rounded-t-lg p-4">
                  <div
                    className="bg-gray-800 p-4 text-xl font-bold text-white rounded-lg"
                    id="set-modal-title"
                  >
                    Eliminar Set {showSetInfoModal.setIdx + 1}
                  </div>
                  <div className="space-y-4 mt-4">
                    <button
                      className="w-full flex items-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
                      onClick={() =>
                        handleRemoveSet(
                          showSetInfoModal.setIdx,
                          showSetInfoModal.exerciseIdx
                        )
                      }
                    >
                      <X /> Remover Set
                    </button>
                  </div>
                  <button
                    className="mt-6 w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                    onClick={() =>
                      setShowSetInfoModal({
                        show: false,
                        setIdx: 0,
                        exerciseIdx: 0,
                      })
                    }
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {showExercisesModal && (
              <div className="overflow-hidden scrollbar-none fixed inset-0 bg-background-color flex items-center justify-center p-4 z-50">
                <div className="bg-red dark:bg-black rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Procurar exercício..."
                      className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block p-2.5 dark:bg-background-alt dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400 w-full mb-3"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <select
                      className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block p-2.5 dark:bg-background-alt dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400 w-full"
                      value={equipmentFilter}
                      onChange={(e) => setEquipmentFilter(e.target.value)}
                    >
                      <option value="">Todos equipamentos</option>
                      <option value="Cardio">Cardio</option>
                      <option value="Musculacao">Musculação</option>
                      <option value="Funcional">Funcional</option>
                    </select>
                  </div>
                  <div className="mt-3">
                    <h1>Todos os Exercícios</h1>
                    <hr />
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: { staggerChildren: 0.1 },
                        },
                      }}
                    >
                      {filteredExercises?.map((exercise) => (
                        <motion.div
                          key={exercise.exerciseId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.05 }}
                          className={`p-2 dark:text-white text-white rounded-lg flex items-center gap-4 my-3 cursor-pointer hover:bg-neutral-900  ${
                            selectedExercises.some(
                              (e) =>
                                e.exerciseId === String(exercise.exerciseId)
                            )
                              ? " bg-blue-100 dark:bg-blue-900 border-l-4 border-yellow-500"
                              : "border-l-4 border-transparent"
                          }`}
                          onClick={() => {
                            if (
                              !selectedExercises.some(
                                (e) =>
                                  e.exerciseId === String(exercise.exerciseId)
                              )
                            ) {
                              setSelectedExercises([
                                ...selectedExercises,
                                {
                                  exerciseId: String(exercise.exerciseId),
                                  name: exercise.name,
                                  imageUrl: exercise.imageUrl,
                                  sets: [],
                                  targetMuscle: exercise.targetMuscle,
                                  exerciseType: exercise.exerciseType,
                                },
                              ]);
                            } else {
                              setSelectedExercises(
                                selectedExercises.filter(
                                  (e) =>
                                    e.exerciseId !== String(exercise.exerciseId)
                                )
                              );
                            }
                          }}
                        >
                          <img
                            src={exercise.imageUrl}
                            alt={exercise.name}
                            className="h-12 w-12 object-cover rounded-full"
                          />
                          <div>
                            <h1 className="font-medium">{exercise.name}</h1>
                            <p>{exercise.targetMuscle}</p>
                          </div>
                        </motion.div>
                      ))}
                      {filteredExercises?.length === 0 && (
                        <div className="text-center">
                          <p className="my-4">
                            Infelizmente, ainda não temos esse exercício no
                            nosso banco de dados
                          </p>
                        </div>
                      )}
                    </motion.div>
                    {selectedExercises.length > 0 && (
                      <motion.button
                        className="w-full bg-blue-950 p-2 rounded-lg flex items-center justify-center"
                        onClick={() => {
                          addNewExercise(selectedExercises);
                          setSelectedExercises([]);
                          setShowExercisesModal(false);
                        }}
                      >
                        Adicionar {selectedExercises.length}{" "}
                        {selectedExercises.length > 1
                          ? "Exercícios"
                          : "Exercício"}
                      </motion.button>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "gray" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowExercisesModal(false)}
                    className="mt-4 text-white bg-blue-500 px-4 py-2 rounded"
                  >
                    Voltar
                  </motion.button>
                </div>
              </div>
            )}

            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <button onClick={toggleMinimize} className="text-gray-500">
                  {minimized ? <Plus /> : <Minus />}
                </button>
              </div>
              <div className="mb-4 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm">Duração</p>
                  <p className="text-secondary-200">{timer} min</p>
                </div>
                <div>
                  <p>Volume</p>
                  <p>
                    {activeWorkout.exercises.reduce(
                      (total, exercise) =>
                        total +
                        exercise.sets.reduce(
                          (setTotal, set) => setTotal + set.reps * set.weight,
                          0
                        ),
                      0
                    )}{" "}
                    kg
                  </p>
                </div>
                <div>
                  <p>Sets</p>
                  <p>
                    {activeWorkout.exercises.reduce(
                      (total, exercise) => total + exercise.sets.length,
                      0
                    )}
                  </p>
                </div>
              </div>

              {activeWorkout.exercises.map((exercise, idx) => (
                <div key={idx} className="mb-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={exercise.imageUrl}
                      alt={exercise.name}
                      className="h-12 w-12 object-cover rounded-full mb-4"
                    />
                    <h1 className="font-medium mb-2">{exercise.name}</h1>
                    <div
                      className="ml-auto cursor-pointer"
                      onClick={() =>
                        setShowExerciseInfoModal({
                          show: true,
                          exerciseIdx: idx,
                        })
                      }
                    >
                      <EllipsisVerticalIcon className="h-6 w-6" />
                    </div>
                  </div>

                  {exercise.sets.map((set, setIdx) => (
                    <motion.div
                      key={setIdx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 grid grid-cols-[auto_1fr_1fr_auto] gap-2 justify-items-center"
                    >
                      <h1
                        className="text-sm w-full mb-2 flex items-end cursor-pointer hover:text-blue-500 transition-colors duration-200"
                        onClick={() =>
                          setShowSetInfoModal({
                            show: true,
                            setIdx: setIdx,
                            exerciseIdx: idx,
                          })
                        }
                        aria-label={`Abrir opções para o Set ${setIdx + 1}`}
                      >
                        SET {setIdx + 1}
                      </h1>
                      <div className="flex flex-col items-center">
                        <h1 className="text-sm text-gray-400 font-bold mb-2">
                          KG
                        </h1>
                        <input
                          type="number"
                          min="0"
                          placeholder={set.weight.toString()}
                          value={set.weight || ""}
                          onChange={(e) =>
                            updateSetValues(
                              idx,
                              setIdx,
                              "weight",
                              Number(e.target.value)
                            )
                          }
                          className={`lg:ml-2.5 py-1 w-full text-center border rounded dark:bg-gray-700 ${
                            exerciseErrors[idx]?.sets?.[setIdx]?.weight
                              ? "border-red-500 text-red-500"
                              : ""
                          }`}
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        <h1 className="text-sm text-gray-400 font-bold mb-2">
                          REPS
                        </h1>
                        <input
                          type="number"
                          min="0"
                          placeholder={set.reps.toString()}
                          value={set.reps || ""}
                          onChange={(e) =>
                            updateSetValues(
                              idx,
                              setIdx,
                              "reps",
                              Number(e.target.value)
                            )
                          }
                          className={`lg:ml-2.5 w-full py-1 text-center border rounded dark:bg-gray-700 ${
                            exerciseErrors[idx]?.sets?.[setIdx]?.reps
                              ? "border-red-500 text-red-500"
                              : ""
                          }`}
                        />
                      </div>
                    </motion.div>
                  ))}

                  <button
                    className="w-full bg-neutral-950 p-1 rounded-lg flex items-center justify-center"
                    onClick={() => addSetToExercise(idx)}
                  >
                    <Plus className="mr-1" /> Adicionar Repetição
                  </button>
                </div>
              ))}

              <div>
                <button
                  className="w-full bg-blue-950 p-1 rounded-lg mb-6 flex items-center justify-center"
                  onClick={() => setShowExercisesModal(true)}
                >
                  <Plus className="mr-1" /> Adicionar Exercício
                </button>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={discardWorkout}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                >
                  Descartar
                </button>
                <button
                  onClick={finishWorkout}
                  disabled={
                    !activeWorkout.exercises ||
                    activeWorkout.exercises.length === 0
                  }
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                >
                  Terminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MINIMIZED WORKOUT */}
      {minimized && activeWorkout && (
        <div className="w-full text-center fixed bottom-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <div>
            <p className="font-bold">Treino em andamento</p>
            <p className="text-sm text-gray-500">{activeWorkout.title}</p>
          </div>
          <div className="mt-2">
            <button
              onClick={toggleMinimize}
              className="text-blue-500 hover:underline mr-6"
            >
              Resumir
            </button>
            <button
              onClick={discardWorkout}
              className="text-red-500 hover:underline"
            >
              Descartar
            </button>
          </div>
        </div>
      )}

      {/* HOME */}
      {!activeWorkout || (activeWorkout && minimized) ? (
        <div className="max-w-9xl p-8 shadow-lg rounded-lg w-5/6 dark:bg-background-alt mx-auto max-w-9xl px-4">
          <div className="items-center lg:flex justify-between mb-8 flex-col md:flex-row">
            <h1 className="text-3xl font-bold">Planos de Treino</h1>
          </div>
          <button
            onClick={createEmptyWorkout}
            className="flex items-center mb-8 bg-neutral-900 py-2 px-2 rounded-md hover:bg-neutral-950"
          >
            <Plus className="mr-1" /> Começar um treino vazio
          </button>
          <h1 className="text-3xl font-bold mb-2">Rotinas</h1>

          {showWorkoutInProgressModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="align-center bg-white dark:bg-black p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-lg font-semibold mb-4">
                  Tens um treino em andamento.
                </h2>
                <p className="mb-4">
                  Se iniciares um novo treino, o teu treino atual será
                  descartado. Tens a certeza de que queres iniciar um novo
                  treino?
                </p>
                <button
                  onClick={() => {
                    setShowWorkoutInProgressModal(false);
                    toggleMinimize();
                  }}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Retomar treino em andamento
                </button>
                <button
                  onClick={() => {
                    if (workoutToStart) {
                      discardWorkout();
                      startWorkout(workoutToStart);
                    }
                  }}
                  className="px-4 mt-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Descartar o treino em andamento
                </button>
              </div>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dataUserWorkout?.map((workout) => (
              <div
                key={workout.workoutPlanId}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{workout.name}</h2>
                    <Calendar className="h-5 w-5 text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Criada: {workout.createdAt}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Criada por:{" "}
                    {workout.madeByUser.fname + " " + workout.madeByUser.lname}
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <div className="flex flex-wrap gap-1"></div>
                  </div>
                  <div className="text-gray-400 text-sm font-semibold">
                    {(() => {
                      const exercisesString = workout.exercises
                        .map((exercise) => exercise.exerciseName)
                        .join(", ");
                      return exercisesString.length > 35
                        ? exercisesString.slice(0, 30) + "..."
                        : exercisesString;
                    })()}
                  </div>
                  <button
                    onClick={() => {
                      const workoutData: WorkoutData = {
                        workoutPlanId: workout.workoutPlanId,
                        createdAt: workout.createdAt,
                        name: workout.name,
                        madeByUser: workout.madeByUser,
                        exercises: workout.exercises.map((exercise) => ({
                          exercise: {
                            exerciseId: String(exercise.exerciseId),
                            name: exercise.exerciseName || "",
                            imageUrl: exercise.imageUrl,
                            targetMuscle: exercise.targetMuscle,
                            exerciseType: exercise.exerciseType,
                          },
                          sets: exercise.sets,
                          reps: exercise.reps,
                          weight: exercise.weight,
                        })),
                      };
                      handleStartWorkoutClick(workoutData);
                    }}
                    className="w-full mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Começar este treino
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default PlanoTreino;
