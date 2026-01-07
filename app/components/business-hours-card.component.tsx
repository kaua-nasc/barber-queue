import { useSchedule } from "~/hooks/use-schedule.hook";

const DAYS_TRANSLATION: { [key: string]: string } = {
  monday: "Seg",
  tuesday: "Ter",
  wednesday: "Qua",
  thursday: "Qui",
  friday: "Sex",
  saturday: "Sáb",
  sunday: "Dom",
};

const ORDERED_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function BusinessHoursCard() {
  const { schedule, isOpenNow } = useSchedule();
  const todayIndex = new Date().getDay(); 
  const jsDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDayKey = jsDays[todayIndex];

  return (
    <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
       <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${isOpenNow() ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Horários de Atendimento
        </h3>
      </div>

      <div className="space-y-3">
        {ORDERED_DAYS.map((dayKey) => {
          const day = schedule?.[dayKey] || { isOpen: false, start: "00:00", end: "00:00" };
          const isToday = dayKey === currentDayKey;

          return (
            <div 
              key={dayKey} 
              className={`flex items-center justify-between text-sm ${isToday ? 'bg-slate-50 -mx-3 px-3 py-2 rounded-lg' : ''}`}
            >
              <span className={`font-bold ${isToday ? 'text-slate-900' : 'text-slate-400'}`}>
                {DAYS_TRANSLATION[dayKey]}
                {isToday && <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider">Hoje</span>}
              </span>
              
              <span className={`font-medium ${isToday ? 'text-slate-700' : 'text-slate-500'}`}>
                {day.isOpen ? (
                  `${day.start} - ${day.end}`
                ) : (
                  <span className="text-slate-300 italic">Fechado</span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}