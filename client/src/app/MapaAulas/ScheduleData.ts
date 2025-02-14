interface ScheduleItem {
  time: string;
  activity: string;
  studio: string;
  duration: string;
  bgColor?: string;
  isOnline?: boolean;
}

interface DaySchedule {
  manhã: ScheduleItem[];
  tarde: ScheduleItem[];
  noite: ScheduleItem[];
}

interface ScheduleData {
  Segunda: DaySchedule;
  Terça: DaySchedule;
  Quarta: DaySchedule;
  Quinta: DaySchedule;
  Sexta: DaySchedule;
  Sábado: DaySchedule;
  Domingo: DaySchedule;
}

// Now use the types in your schedule data
export const scheduleData: ScheduleData = {
  Segunda: {
    manhã: [
      {
        time: "07:00",
        activity: "Aula de Yoga",
        studio: "Estúdio Zen",
        duration: "60'",
        bgColor: "bg-green-200",
      },
      {
        time: "08:30",
        activity: "CrossFit",
        studio: "BOX 1",
        duration: "45'",
      },
      {
        time: "10:00",
        activity: "Pilates",
        studio: "Estúdio Pilates",
        duration: "50'",
      },
    ],
    tarde: [
      {
        time: "14:30",
        activity: "BodyPump",
        studio: "Estúdio Principal",
        duration: "60'",
        bgColor: "bg-red-300",
      },
      {
        time: "16:00",
        activity: "Zumba",
        studio: "Estúdio Dança",
        duration: "45'",
      },
    ],
    noite: [
      {
        time: "18:30",
        activity: "HIIT",
        studio: "Estúdio Cardio",
        duration: "30'",
        bgColor: "bg-yellow-300",
      },
      {
        time: "19:30",
        activity: "Boxe",
        studio: "BOX 1",
        duration: "60'",
      },
      {
        time: "20:30",
        activity: "Aula de Alongamentos",
        studio: "Estúdio Zen",
        duration: "30'",
        bgColor: "bg-purple-200",
      },
    ],
  },
  Terça: {
    manhã: [
      {
        time: "07:05",
        activity: "Calistenia",
        studio: "Estúdio BOX FIT IT",
        duration: "45'",
        bgColor: "bg-secondary-700",
      },
      {
        time: "07:10",
        activity: "Bike ICG",
        studio: "Estúdio Bike",
        duration: "45'",
      },
      {
        time: "11:00",
        activity: "Virtual Bike",
        studio: "Estúdio Bike",
        duration: "45'",
      },
      {
        time: "11:50",
        activity: "PILATES",
        studio: "Aulas LIVE",
        duration: "45'",
        isOnline: true,
      },
    ],
    tarde: [
      {
        time: "15:00",
        activity: "Kickboxing",
        studio: "BOX 2",
        duration: "60'",
        bgColor: "bg-orange-300",
      },
    ],
    noite: [
      {
        time: "18:00",
        activity: "Spinning",
        studio: "Sala de Spinning",
        duration: "50'",
      },
      {
        time: "19:30",
        activity: "CrossFit",
        studio: "BOX 1",
        duration: "45'",
        bgColor: "bg-black",
      },
    ],
  },
  Quarta: {
    manhã: [
      {
        time: "06:30",
        activity: "Corrida na Passadeira",
        studio: "Ginásio",
        duration: "30'",
      },
      {
        time: "08:00",
        activity: "Aula de TRX",
        studio: "Estúdio Funcional",
        duration: "45'",
      },
    ],
    tarde: [
      {
        time: "13:30",
        activity: "BodyCombat",
        studio: "Estúdio Principal",
        duration: "55'",
      },
    ],
    noite: [
      {
        time: "18:30",
        activity: "Aula de Pilates",
        studio: "Estúdio Pilates",
        duration: "50'",
        bgColor: "bg-pink-300",
      },
      {
        time: "20:00",
        activity: "Aula de Meditação",
        studio: "Estúdio Zen",
        duration: "40'",
        bgColor: "bg-blue-100",
      },
    ],
  },
  Quinta: {
    manhã: [
      {
        time: "07:15",
        activity: "Treino Funcional",
        studio: "Estúdio 1",
        duration: "60'",
      },
    ],
    tarde: [
      {
        time: "15:30",
        activity: "Aula de Dança Contemporânea",
        studio: "Estúdio Dança",
        duration: "60'",
      },
    ],
    noite: [
      {
        time: "18:45",
        activity: "Aula de Spinning",
        studio: "Sala de Spinning",
        duration: "50'",
        bgColor: "bg-red-200",
      },
      {
        time: "20:00",
        activity: "BodyBalance",
        studio: "Estúdio Zen",
        duration: "60'",
      },
    ],
  },
  Sexta: {
    manhã: [
      {
        time: "08:00",
        activity: "Aula de Step",
        studio: "Estúdio Principal",
        duration: "50'",
        bgColor: "bg-blue-200",
      },
    ],
    tarde: [
      {
        time: "14:00",
        activity: "CrossFit",
        studio: "BOX 1",
        duration: "60'",
        bgColor: "bg-black",
      },
    ],
    noite: [
      {
        time: "19:00",
        activity: "Aula de Yoga",
        studio: "Estúdio Zen",
        duration: "60'",
      },
      {
        time: "20:15",
        activity: "Alongamentos",
        studio: "Estúdio Zen",
        duration: "30'",
      },
    ],
  },
  Sábado: {
    manhã: [
      {
        time: "09:00",
        activity: "CrossFit",
        studio: "BOX 1",
        duration: "60'",
      },
      {
        time: "10:30",
        activity: "Aula de Spinning",
        studio: "Sala de Spinning",
        duration: "45'",
      },
    ],
    tarde: [
      {
        time: "16:00",
        activity: "Treino Livre",
        studio: "Ginásio",
        duration: "120'",
      },
    ],
    noite: [],
  },
  Domingo: {
    manhã: [
      {
        time: "10:00",
        activity: "Aula de Yoga",
        studio: "Estúdio Zen",
        duration: "60'",
      },
    ],
    tarde: [],
    noite: [],
  },
};
