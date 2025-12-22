import { onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "~/services/firebase";

export interface AppSettings {
  barbershopName: string;
  barberName: string;
  logoUrl: string;
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const settingsRef = ref(db, "settings");

  useEffect(() => {
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSettings(data);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateSettings = async (newSettings: AppSettings) => {
    await set(settingsRef, newSettings);
  };

  return { settings, updateSettings, loading };
}
