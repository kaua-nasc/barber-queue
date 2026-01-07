import { onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "~/services/firebase";

export interface AppNotice {
  isVisible: boolean;
  message: string;
  type: 'info' | 'alert' | 'success';
}

const DEFAULT_NOTICE: AppNotice = {
  isVisible: false,
  message: "",
  type: 'info'
};

export function useNotice() {
  const [notice, setNotice] = useState<AppNotice>(DEFAULT_NOTICE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const noticeRef = ref(db, "notice");

    const unsubscribe = onValue(noticeRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setNotice(data);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateNotice = async (newNotice: AppNotice) => {
    const noticeRef = ref(db, "notice");
    await set(noticeRef, newNotice);
  };

  return { notice, updateNotice, loading };
}