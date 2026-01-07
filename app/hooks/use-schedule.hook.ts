import { onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "~/services/firebase";

export interface DaySchedule {
  start: string;
  end: string;
  isOpen: boolean;
}

export interface WeeklySchedule {
  [key: string]: DaySchedule;
}

const DEFAULT_SCHEDULE: WeeklySchedule = {
  monday: { start: "09:00", end: "20:00", isOpen: true },
  tuesday: { start: "09:00", end: "20:00", isOpen: true },
  wednesday: { start: "09:00", end: "20:00", isOpen: true },
  thursday: { start: "09:00", end: "20:00", isOpen: true },
  friday: { start: "09:00", end: "21:00", isOpen: true },
  saturday: { start: "09:00", end: "19:00", isOpen: true },
  sunday: { start: "00:00", end: "00:00", isOpen: false },
};

export function useSchedule() {
  const [schedule, setSchedule] = useState<WeeklySchedule>(DEFAULT_SCHEDULE);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const scheduleRef = ref(db, "schedule");

    const unsubscribe = onValue(scheduleRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSchedule(() => ({
          ...DEFAULT_SCHEDULE,
          ...data
        }));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateSchedule = async (newSchedule: WeeklySchedule) => {
    const scheduleRef = ref(db, "schedule");
    await set(scheduleRef, newSchedule);
  };

  const isOpenNow = (): boolean => {
    if (loading) return false;

    const now = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDayKey = days[now.getDay()];
    const todaySchedule = schedule?.[currentDayKey];

    if (!todaySchedule || !todaySchedule.isOpen) return false;

    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    if (!todaySchedule.start || !todaySchedule.end) return false;

    const [startHour, startMin] = todaySchedule.start.split(':').map(Number);
    const [endHour, endMin] = todaySchedule.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    return currentTime >= startTime && currentTime < endTime;
  };

  return { schedule, updateSchedule, isOpenNow, loading };
}