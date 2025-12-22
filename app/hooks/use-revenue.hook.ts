import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "~/services/firebase";

export function useRevenue() {
  const [dailyTotal, setDailyTotal] = useState(0);
  const [clientCount, setClientCount] = useState(0);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const historyRef = ref(db, `history/${today}`);

    const unsubscribe = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const finishedClients = Object.values(data) as any[];

        const total = finishedClients.reduce((acc, client) => {
          return acc + (client.total || 0);
        }, 0);

        setDailyTotal(total);
        setClientCount(finishedClients.length);
      } else {
        setDailyTotal(0);
        setClientCount(0);
      }
    });

    return () => unsubscribe();
  }, [today]);

  return { dailyTotal, clientCount };
}
