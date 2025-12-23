import { ScissorIcon } from "~/components/icons/scissor-icon.component";
import type { Route } from "../+types/root";
import { useQueue } from "~/hooks/use-queue.hook";
import { ClockIcon } from "~/components/icons/clock-icon.component";
import { useStatus } from "~/hooks/use-status.hook";
import { Status } from "~/interfaces/status.interface";
import { useSettings } from "~/hooks/use-settings.hook";
import { useEffect, useState } from "react";
import { SettingsModal } from "~/components/modals/settings-modal.component";
import { Link, useNavigate } from "react-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "~/services/firebase";
import { ServicesModal } from "~/components/modals/services-modal.compoent";
import { useServices } from "~/hooks/use-services.hook";
import { useRevenue } from "~/hooks/use-revenue.hook";
import { HistoryModal } from "~/components/modals/history-modal.component";
import { FinishModal } from "~/components/modals/finish-modal.component";

const PencilIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
    />
  </svg>
);

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

const MoneyIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ChartIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Painel Admin | Lemes Barbearia" },
    { name: "description", content: "Gerenciamento de fila" },
  ];
}

export default function Admin() {
  const navigate = useNavigate();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

  const { queue, finishClient, removeClient } = useQueue();
  const { status, close, open } = useStatus();
  const { settings, updateSettings } = useSettings();
  const { services } = useServices();
  const { dailyTotal, clientCount } = useRevenue();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const currentClient = queue[0];
  const nextInLine = queue.slice(1);

  const onConfirmFinish = async (finalServices: string[]) => {
    if (currentClient) {
      await finishClient(currentClient, finalServices, services);
      setIsFinishModalOpen(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      } else {
        setIsAuthChecking(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const toggleStatus = () => {
    if (status === Status.open) {
      close();
    } else {
      open();
    }
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6 lg:p-10 selection:bg-slate-200">
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
      {settings && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          currentSettings={settings}
          onSave={updateSettings}
        />
      )}
      <ServicesModal
        isOpen={isServicesOpen}
        onClose={() => setIsServicesOpen(false)}
      />
      {currentClient && (
        <FinishModal
          isOpen={isFinishModalOpen}
          onClose={() => setIsFinishModalOpen(false)}
          clientName={currentClient.name}
          initialServices={currentClient.services}
          allServices={services}
          onConfirm={onConfirmFinish}
        />
      )}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-slate-200 gap-4">
        <div className="flex items-center gap-4 group">
          <div className="bg-white text-slate-800 p-1 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-slate-100 relative overflow-hidden w-20 h-20 flex items-center justify-center">
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <ScissorIcon className="w-6 h-6" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {settings?.barbershopName}
              </h1>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-1.5 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                title="Editar informações"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Painel do {settings?.barberName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsServicesOpen(true)}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 mt-1"
          >
            Gerenciar Preços e Serviços
          </button>
          <Link
            to="/reports"
            className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1"
          >
            <ChartIcon className="w-3 h-3" />
            Relatórios
          </Link>
          <button
            onClick={toggleStatus}
            className={`group flex items-center gap-3 px-1 py-1 pr-4 rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 shadow-sm ${
              status === Status.open
                ? "bg-white border-emerald-200 hover:border-emerald-300"
                : "bg-white border-rose-200 hover:border-rose-300"
            }`}
          >
            <div
              className={`w-12 h-7 rounded-full relative transition-colors duration-300 flex items-center shadow-inner ${
                status === Status.open ? "bg-emerald-500" : "bg-rose-500"
              }`}
            >
              <div
                className={`absolute w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${
                  status === Status.open ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </div>

            <div className="flex flex-col items-start">
              <span
                className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                  status === Status.open ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {status === Status.open ? "Aberto" : "Fechado"}
              </span>
            </div>
          </button>
          <button
            onClick={handleLogout}
            className="bg-white p-3 rounded-full border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all shadow-sm"
            title="Sair do sistema"
          >
            <LogoutIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest pl-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
            Na Cadeira Agora
          </h2>

          {currentClient ? (
            <div className="bg-white text-slate-900 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white ring-1 ring-slate-100 relative overflow-hidden flex-1 min-h-112.5 flex flex-col justify-between group hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all">
              <div className="absolute -top-10 -right-10 opacity-[0.03] rotate-12 transition-transform group-hover:rotate-6">
                <ScissorIcon className="w-80 h-80" />
              </div>

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 bg-slate-100 rounded-full text-xs font-bold text-slate-500 border border-slate-200">
                    Senha #{currentClient.id.toString().slice(-3)}
                  </span>
                  <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <ClockIcon className="w-3.5 h-3.5" />
                    {new Date(currentClient.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <h3 className="text-6xl font-black tracking-tighter mb-4 text-slate-900">
                  {currentClient.name}
                </h3>

                <div className="flex flex-wrap gap-2 mt-4">
                  {currentClient.services.map((s) => (
                    <span
                      key={s}
                      className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-900/10"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-12 relative z-10">
                <button
                  onClick={() => setIsFinishModalOpen(true)}
                  className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/30 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Finalizar Atendimento
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center h-112.5">
              <div className="bg-slate-50 p-6 rounded-full mb-6 shadow-sm">
                <ClockIcon className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">
                Cadeira Livre
              </h3>
              <p className="text-slate-400 mt-2 font-medium">
                Nenhum cliente na fila de espera.
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-end mb-6 px-2">
            <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
              Próximos ({nextInLine.length})
            </h2>
            {nextInLine.length > 0 && (
              <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                + {nextInLine.length * 30} min
              </span>
            )}
          </div>

          <div className="bg-white rounded-4xl p-6 flex-1 overflow-y-auto custom-scrollbar shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 ring-1 ring-slate-50/50">
            {nextInLine.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 text-sm font-medium">
                <p>Lista de espera vazia.</p>
              </div>
            ) : (
              nextInLine.map((client, index) => (
                <div
                  key={client.id}
                  className="group flex items-center justify-between p-4 mb-3 bg-slate-50 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 rounded-2xl border border-transparent hover:border-slate-100 transition-all duration-200"
                >
                  <div className="flex items-center gap-5">
                    <span className="flex items-center justify-center w-10 h-10 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-800 text-lg leading-tight">
                        {client.name}
                      </p>
                      <p className="text-xs font-medium text-slate-400 mt-1">
                        {client.services.join(", ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100">
                      {new Date(client.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <button
                      onClick={() => removeClient(client.id)}
                      title="Remover da fila"
                      className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div
          onClick={() => setIsHistoryOpen(true)}
          className="bg-white p-6 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center justify-between relative overflow-hidden cursor-pointer group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-emerald-200 transition-all"
        >
          <div className="absolute -right-4 -top-4 bg-emerald-50 w-24 h-24 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
              Faturamento Hoje
              <svg
                className="w-3 h-3 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                R$ {dailyTotal.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium group-hover:text-slate-500">
              {clientCount} atendimentos • Clique para ver detalhes
            </p>
          </div>

          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 z-10 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            <MoneyIcon className="w-6 h-6" />
          </div>
        </div>
      </div>
    </main>
  );
}
