import { useHistory } from "~/hooks/use-history.hook";
import { ClockIcon } from "../icons/clock-icon.component";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  const { history, loading } = useHistory();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden ring-1 ring-slate-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 bg-slate-50/80 backdrop-blur-md flex justify-between items-center sticky top-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Histórico do Dia
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Lista de cortes finalizados hoje.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total
            </span>
            <p className="text-xl font-black text-emerald-600">
              R$ {history.reduce((acc, item) => acc + item.total, 0).toFixed(2)}
            </p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar bg-white">
          {loading ? (
            <p className="text-center text-slate-400 py-10">A carregar...</p>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-300">
              <ClockIcon className="w-12 h-12 mb-2 opacity-50" />
              <p>Nenhum atendimento finalizado ainda.</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 shadow-sm">
                    {new Date(item.finishedAt).getHours()}:
                    {String(new Date(item.finishedAt).getMinutes()).padStart(
                      2,
                      "0"
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {item.services.join(" + ")}
                    </p>
                  </div>
                </div>

                <div className="mt-3 sm:mt-0 flex items-center justify-end">
                  <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-lg">
                    R$ {item.total.toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors text-sm"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
