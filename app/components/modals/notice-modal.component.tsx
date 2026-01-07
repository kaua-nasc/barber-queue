import { useEffect, useState } from "react";
import type { AppNotice } from "~/hooks/use-notice.hook";

interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notice: AppNotice) => void;
  currentNotice: AppNotice;
}

export function NoticeModal({ isOpen, onClose, onSave, currentNotice }: NoticeModalProps) {
  const [localNotice, setLocalNotice] = useState<AppNotice>(currentNotice);

  useEffect(() => {
    if (currentNotice) {
      setLocalNotice(currentNotice);
    }
  }, [isOpen, currentNotice]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localNotice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Painel de Avisos</h2>
            <p className="text-sm text-slate-400">Configure avisos para os clientes</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Toggle Ativo/Inativo */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="font-bold text-slate-700">Exibir Aviso na Home?</span>
            <button
              onClick={() => setLocalNotice(prev => ({ ...prev, isVisible: !prev.isVisible }))}
              className={`w-12 h-7 rounded-full relative transition-colors duration-300 flex items-center ${localNotice.isVisible ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
              <div className={`absolute w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${localNotice.isVisible ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Tipo de Aviso */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Mensagem</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setLocalNotice(prev => ({ ...prev, type: 'info' }))}
                className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${localNotice.type === 'info' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
              >
                Informação
              </button>
              <button
                onClick={() => setLocalNotice(prev => ({ ...prev, type: 'alert' }))}
                className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${localNotice.type === 'alert' ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
              >
                Alerta
              </button>
              <button
                onClick={() => setLocalNotice(prev => ({ ...prev, type: 'success' }))}
                className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${localNotice.type === 'success' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
              >
                Sucesso
              </button>
            </div>
          </div>

          {/* Mensagem */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Mensagem</label>
            <textarea
              value={localNotice.message}
              onChange={(e) => setLocalNotice(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Ex: Voltaremos às 14h..."
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-200 rounded-xl transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95">
            Salvar Aviso
          </button>
        </div>
      </div>
    </div>
  );
}