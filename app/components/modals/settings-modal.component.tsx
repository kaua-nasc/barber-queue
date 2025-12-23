import { useState } from "react";
import type { AppSettings } from "~/hooks/use-settings.hook";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  currentSettings,
  onSave,
}: SettingsModalProps) {
  const [formData, setFormData] = useState<AppSettings>(currentSettings);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden ring-1 ring-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">
            Editar Informações
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Personalize sua barbearia
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
              Nome da Barbearia
            </label>
            <input
              type="text"
              value={formData.barbershopName}
              onChange={(e) =>
                setFormData({ ...formData, barbershopName: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
              Nome do Barbeiro
            </label>
            <input
              type="text"
              value={formData.barberName}
              onChange={(e) =>
                setFormData({ ...formData, barberName: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="flex-1 px-4 py-3 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-colors text-sm disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 hover:-translate-y-0.5 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "Aguarde..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
