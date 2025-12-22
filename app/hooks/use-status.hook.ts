import { onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { Status } from "~/interfaces/status.interface";
import { db } from "~/services/firebase";

export function useStatus() {
  const [status, setStatus] = useState<Status>(Status.closed);
  const statusRef = ref(db, "status");

  useEffect(() => {
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();

      console.log("Status data:", data);

      if (data !== null && data.status !== undefined) {
        setStatus(data.status);
      } else {
        setStatus(Status.closed);
      }
    });

    return () => unsubscribe();
  }, []);

  const close = async () => {
    await set(statusRef, { status: Status.closed });

    setStatus(Status.closed);
  };

  const open = async () => {
    await set(statusRef, { status: Status.open });
    setStatus(Status.open);
  };

  return { status, open, close };
}
