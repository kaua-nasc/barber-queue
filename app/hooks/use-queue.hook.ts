import { onValue, push, ref, remove, set } from "firebase/database";
import { useState, useEffect } from "react";
import type { Client } from "~/interfaces/client.interface";
import { db } from "~/services/firebase";
import type { ServiceItem } from "./use-services.hook";

export function useQueue() {
  const [queue, setQueue] = useState<Client[]>([]);
  const queueRef = ref(db, "queue");

  useEffect(() => {
    const unsubscribe = onValue(queueRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const parsedQueue = Object.entries(data).map(([key, value]: any) => ({
          ...value,
          id: key,
        }));

        parsedQueue.sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
        );

        setQueue(parsedQueue);
      } else {
        setQueue([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const addClient = async (name: string, services: string[]) => {
    const newClientRef = push(queueRef);

    await set(newClientRef, {
      name,
      services,
      time: new Date().toISOString(),
    });

    return newClientRef.key;
  };

  const removeClient = async (id: string) => {
    const itemRef = ref(db, `queue/${id}`);
    await remove(itemRef);
  };

  const finishClient = async (
    client: Client,
    finalServices: string[],
    catalog: ServiceItem[]
  ) => {
    const totalValue = finalServices.reduce((acc, serviceName) => {
      const serviceItem = catalog.find((s) => s.name === serviceName);
      return acc + (serviceItem ? serviceItem.price : 0);
    }, 0);

    const today = new Date().toISOString().split("T")[0];
    const historyRef = ref(db, `history/${today}/${client.id}`);

    await set(historyRef, {
      name: client.name,
      services: finalServices,
      total: totalValue,
      finishedAt: new Date().toISOString(),
    });

    await removeClient(client.id);
  };

  return { queue, addClient, removeClient, finishClient };
}
