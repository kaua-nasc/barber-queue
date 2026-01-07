import { useEffect, useState } from "react";
import type { WeeklySchedule } from "~/hooks/use-schedule.hook";

interface HoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (schedule: WeeklySchedule) => void;
  currentSchedule?: WeeklySchedule;
}

const DAYS_MAP: { [key: string]: string } = {
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
  sunday: "Domingo",
};

const EMPTY_SCHEDULE: WeeklySchedule = {
  monday: { start: "09:00", end: "20:00", isOpen: true },
  tuesday: { start: "09:00", end: "20:00", isOpen: true },
  wednesday: { start: "09:00", end: "20:00", isOpen: true },
  thursday: { start: "09:00", end: "20:00", isOpen: true },
  friday: { start: "09:00", end: "21:00", isOpen: true },
  saturday: { start: "09:00", end: "19:00", isOpen: true },
  sunday: { start: "00:00", end: "00:00", isOpen: false },
};

export function HoursModal({ isOpen, onClose, onSave, currentSchedule }: HoursModalProps) {
  const [schedule, setSchedule] = useState<WeeklySchedule>(
    currentSchedule || EMPTY_SCHEDULE
  );

  useEffect(() => {
    if (currentSchedule) {
      setSchedule(currentSchedule);
    }
  }, [isOpen, currentSchedule]); 

  if (!isOpen) return null;

  const handleTimeChange = (day: string, field: "start" | "end", value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const toggleDay = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], isOpen: !prev[day].isOpen },
    }));
  };

  const handleSave = () => {
    if (onSave) {
        onSave(schedule);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Horários de Funcionamento</h2>
            <p className="text-sm text-slate-400">Configure a disponibilidade desta semana</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            {Object.entries(DAYS_MAP).map(([key, label]) => {
              const daySchedule = schedule[key] || EMPTY_SCHEDULE[key];
              
              return (
                <div key={key} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${daySchedule.isOpen ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-transparent opacity-75'}`}>
                  <div className="flex items-center gap-3 w-40">
                    <button
                      onClick={() => toggleDay(key)}
                      className={`w-10 h-6 rounded-full relative transition-colors duration-200 ${daySchedule.isOpen ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-all duration-200 ${daySchedule.isOpen ? 'left-5' : 'left-1'}`} />
                    </button>
                    <span className={`font-bold text-sm ${daySchedule.isOpen ? 'text-slate-700' : 'text-slate-400'}`}>{label}</span>
                  </div>

                  <div className="flex items-center gap-4 flex-1 justify-end">
                    {daySchedule.isOpen ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 uppercase">Abre</span>
                          <input
                            type="time"
                            value={daySchedule.start}
                            onChange={(e) => handleTimeChange(key, 'start', e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          />
                        </div>
                        <div className="w-4 h-px bg-slate-300"></div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 uppercase">Fecha</span>
                          <input
                            type="time"
                            value={daySchedule.end}
                            onChange={(e) => handleTimeChange(key, 'end', e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          />
                        </div>
                      </>
                    ) : (
                      <span className="text-sm font-medium text-slate-400 py-2">Fechado</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-200 rounded-xl transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95">
            Salvar Horários
          </button>
        </div>
      </div>
    </div>
  );
}