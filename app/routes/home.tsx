import { ScissorIcon } from "~/components/icons/scissor-icon.component";
import type { Route } from "./+types/home";
import { QueueList } from "~/components/queue-list.component";
import { CurrentPositionStatus } from "~/components/current-position-status.component";
import { JoinQueuePrompt } from "~/components/join-queue-prompt.component";
import { ClockIcon } from "~/components/icons/clock-icon.component";
import { useEffect, useState } from "react";
import { useQueue } from "~/hooks/use-queue.hook";
import { Status } from "~/interfaces/status.interface";
import { useStatus } from "~/hooks/use-status.hook";
import { useSettings } from "~/hooks/use-settings.hook";
import { useServices } from "~/hooks/use-services.hook";
import { BusinessHoursCard } from "~/components/business-hours-card.component";
import { NoticeBanner } from "~/components/notice-banner.component";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Lemes Barbearia | Agendamento" },
    { name: "description", content: "Entre na fila online!" },
  ];
}

const STORAGE_KEY_QUEUE = "barbershop_queue";
const STORAGE_KEY_SESSION = "barbershop_client_id";

export default function Home() {
  const { queue, addClient, removeClient } = useQueue();
  const { settings } = useSettings();
  const { status } = useStatus();
  const { services } = useServices();

  const [mySessionId, setMySessionId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("barbershop_client_id");
      return saved ? saved : null;
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(queue));
  }, [queue]);

  useEffect(() => {
    if (mySessionId) {
      localStorage.setItem(STORAGE_KEY_SESSION, mySessionId.toString());
    } else {
      localStorage.removeItem(STORAGE_KEY_SESSION);
    }
  }, [mySessionId]);

  const handleJoin = async (name: string, services: string[]) => {
    const id = await addClient(name, services);
    setMySessionId(id);
    localStorage.setItem("barbershop_client_id", id.toString());
  };

  const handleLeave = () => {
    if (mySessionId) {
      removeClient(mySessionId);
      setMySessionId(null);
      localStorage.removeItem("barbershop_client_id");
    }
  };

  const defineStatus = () => {
    switch (status) {
      case Status.open:
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-bold text-emerald-700">Aberto</span>
          </div>
        );

      case Status.closed:
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-100 rounded-full shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-sm font-bold text-rose-700">Fechado</span>
          </div>
        );

      default:
        return <></>;
    }
  };

  const myPosition = mySessionId
    ? queue.findIndex((c) => c.id === mySessionId) + 1
    : 0;

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-slate-200">
      <header className="bg-white/90 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white text-slate-800 p-1 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-slate-100 relative overflow-hidden w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
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
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-slate-900 leading-tight">
                {settings?.barbershopName}
              </span>
              <span className="text-xs font-medium text-slate-400">Agendamento Online</span>
            </div>
          </div>

          {defineStatus()}
        </div>
      </header>

      <div className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna 1: Lista da Fila */}
        <div className="lg:col-span-3 order-2 lg:order-1 h-96 lg:h-auto lg:sticky lg:top-28">
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-full overflow-hidden max-h-[80vh] flex flex-col">
            <QueueList title="Fila Atual" items={queue} />
          </div>
        </div>

        {/* Coluna 2: Ação Principal (Entrar na fila/Status) */}
        <div className="lg:col-span-6 order-1 lg:order-2 min-h-125">
          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white h-full relative overflow-hidden flex flex-col ring-1 ring-slate-100">
            <div className="flex-1 h-full">
              {settings && mySessionId && myPosition > 0 ? (
                <CurrentPositionStatus
                  position={myPosition}
                  onLeave={handleLeave}
                  barberName={settings.barberName}
                />
              ) : (
                <JoinQueuePrompt
                  queueSize={queue.length}
                  onJoin={handleJoin}
                  availableServices={services}
                />
              )}
            </div>
          </div>
        </div>

        {/* Coluna 3: Informações e Horários */}
        <div className="lg:col-span-3 order-3 lg:order-3 flex flex-col gap-6 lg:sticky lg:top-28">
          
          <NoticeBanner />
          <BusinessHoursCard />

          <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex-1 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -right-6 -top-6 bg-slate-50 w-32 h-32 rounded-full opacity-50"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3 text-slate-400">
                <div className="p-1.5 bg-slate-50 rounded-lg">
                  <ClockIcon className="w-4 h-4 text-slate-600" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Espera Estimada
                </h3>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">
                  {queue.length * 30}
                </span>
                <span className="text-xl font-medium text-slate-400">min</span>
              </div>

              <div className="w-full bg-slate-100 h-1.5 mt-4 rounded-full overflow-hidden">
                <div className="bg-slate-300 h-full w-1/3 rounded-full"></div>
              </div>
              <p className="text-slate-400 text-[10px] mt-2 font-medium">
                Cálculo baseado na fila atual.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 text-center relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
            <div className="relative z-10 flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                <ScissorIcon className="w-6 h-6 text-slate-300" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Barbeiro</p>
                <h3 className="font-bold text-lg text-slate-900 leading-none">
                  {settings?.barberName || "Profissional"}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}