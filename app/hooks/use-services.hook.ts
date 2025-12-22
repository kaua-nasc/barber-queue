import { onValue, push, ref, remove, set } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "~/services/firebase";

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export function useServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const servicesRef = ref(db, "services");

  useEffect(() => {
    const unsubscribe = onValue(servicesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsedServices = Object.entries(data).map(
          ([key, value]: any) => ({
            id: key,
            ...value,
          })
        );
        setServices(parsedServices);
      } else {
        setServices([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addService = async (name: string, price: number, duration: number) => {
    const newRef = push(servicesRef);
    await set(newRef, { name, price, duration });
  };

  const deleteService = async (id: string) => {
    const itemRef = ref(db, `services/${id}`);
    await remove(itemRef);
  };

  return { services, addService, deleteService, loading };
}
