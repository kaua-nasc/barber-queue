import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "~/services/firebase";

export interface MonthlyData {
  name: string; // "Jan", "Fev"
  revenue: number; // Faturamento
  count: number; // Quantidade de cortes
}

export interface ServiceStat extends Record<string, unknown> {
  name: string;
  value: number; // Quantidade vendida
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
        // Estruturas auxiliares para agregação
        const revenueByMonth: Record<string, number> = {};
        const countByMonth: Record<string, number> = {};
        const servicesCount: Record<string, number> = {};
        let total = 0;

        // Itera sobre as DATAS (chaves do histórico ex: "2023-12-25")
        Object.entries(data).forEach(
          ([dateString, clientsObj]: [string, any]) => {
            const date = new Date(dateString);
            // Cria chave do mês: "Dez", "Jan", etc.
            const monthKey = date.toLocaleString("pt-BR", { month: "short" });

            if (!revenueByMonth[monthKey]) {
              revenueByMonth[monthKey] = 0;
              countByMonth[monthKey] = 0;
            }

            // Itera sobre os CLIENTES daquele dia
            Object.values(clientsObj).forEach((client: any) => {
              // Soma Faturamento
              revenueByMonth[monthKey] += client.total || 0;
              countByMonth[monthKey] += 1;
              total += client.total || 0;

              // Contagem de Serviços
              if (client.services && Array.isArray(client.services)) {
                client.services.forEach((serviceName: string) => {
                  servicesCount[serviceName] =
                    (servicesCount[serviceName] || 0) + 1;
                });
              }
            });
          }
        );

        // 1. Formata dados para o Gráfico de Barras (Faturamento)
        const chartData = Object.keys(revenueByMonth).map((month) => ({
          name: month.charAt(0).toUpperCase() + month.slice(1), // Capitalize
          revenue: revenueByMonth[month],
          count: countByMonth[month],
        }));

        // 2. Formata dados para o Gráfico de Pizza (Serviços)
        const servicesData = Object.entries(servicesCount)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value) // Mais populares primeiro
          .slice(0, 5); // Pega só o top 5

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
