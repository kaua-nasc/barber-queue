import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "~/services/firebase";

export interface MonthlyData {
  name: string;
  revenue: number;
  count: number;
}

export interface ServiceStat extends Record<string, unknown> {
  name: string;
  value: number;
}

export function useReports() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [topServices, setTopServices] = useState<ServiceStat[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const historyRef = ref(db, "history");

    const unsubscribe = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const revenueByMonth: Record<string, number> = {};
        const countByMonth: Record<string, number> = {};
        const servicesCount: Record<string, number> = {};
        let total = 0;

        Object.entries(data).forEach(
          ([dateString, clientsObj]: [string, any]) => {
            const date = new Date(dateString);
            const monthKey = date.toLocaleString("pt-BR", { month: "short" });

            if (!revenueByMonth[monthKey]) {
              revenueByMonth[monthKey] = 0;
              countByMonth[monthKey] = 0;
            }

            Object.values(clientsObj).forEach((client: any) => {
              revenueByMonth[monthKey] += client.total || 0;
              countByMonth[monthKey] += 1;
              total += client.total || 0;

              if (client.services && Array.isArray(client.services)) {
                client.services.forEach((serviceName: string) => {
                  servicesCount[serviceName] =
                    (servicesCount[serviceName] || 0) + 1;
                });
              }
            });
          }
        );

        const chartData = Object.keys(revenueByMonth).map((month) => ({
          name: month.charAt(0).toUpperCase() + month.slice(1),
          revenue: revenueByMonth[month],
          count: countByMonth[month],
        }));

        const servicesData = Object.entries(servicesCount)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);

        setMonthlyData(chartData);
        setTopServices(servicesData);
        setTotalRevenue(total);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { monthlyData, topServices, totalRevenue, loading };
}
