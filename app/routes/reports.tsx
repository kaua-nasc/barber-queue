import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useReports } from "~/hooks/use-reports.hook";
import { Link } from "react-router";
import type { Route } from "../+types/root";

const COLORS = ["#059669", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];

export function meta({}: Route.MetaArgs) {
  return [{ title: "Relatórios Financeiros" }];
}

const ArrowLeftIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

export default function Reports() {
  const { monthlyData, topServices, totalRevenue, loading } = useReports();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">
        Carregando dados...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6 lg:p-10">
      <header className="flex items-center gap-4 mb-10 border-b border-slate-200 pb-6">
        <Link
          to="/admin"
          className="p-2 bg-white rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all"
        >
          <ArrowLeftIcon />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Relatórios Gerenciais
          </h1>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            Métricas e Histórico
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            Faturamento Total
          </h3>
          <p className="text-4xl font-black text-emerald-600">
            R$ {totalRevenue.toFixed(2)}
          </p>
          <p className="text-xs text-slate-400 mt-2">Acumulado histórico</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            Mês Atual (Est.)
          </h3>
          <p className="text-4xl font-black text-slate-800">
            {monthlyData.length > 0
              ? `R$ ${monthlyData[monthlyData.length - 1].revenue.toFixed(2)}`
              : "R$ 0.00"}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            Serviço + Popular
          </h3>
          <p className="text-2xl font-black text-slate-800 truncate">
            {topServices.length > 0 ? topServices[0].name : "-"}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            {topServices.length > 0
              ? `${topServices[0].value} unidades vendidas`
              : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6">
            Faturamento Mensal
          </h2>
          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickFormatter={(value) => `R$${value}`}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6">
            Top Serviços
          </h2>
          <div className="h-75 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topServices}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {topServices.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px" }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  );
}
