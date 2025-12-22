import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "~/services/firebase";

export interface HistoryItem {
  id: string;
  name: string;
  services: string[];
  total: number;
  finishedAt: string;
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const historyRef = ref(db, `history/${today}`);

    const unsubscribe = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const parsedHistory = Object.entries(data).map(([key, value]: any) => ({
          id: key,
          ...value,
        }));

        parsedHistory.sort(
          (a, b) =>
            new Date(b.finishedAt).getTime() - new Date(a.finishedAt).getTime()
        );

        setHistory(parsedHistory);
      } else {
        setHistory([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [today]);

  return { history, loading };
}
