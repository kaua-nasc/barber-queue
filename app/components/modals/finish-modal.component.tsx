import { useEffect, useState } from "react";
import type { ServiceItem } from "~/hooks/use-services.hook";
import { UserCheckIcon } from "../icons/user-check-icon.component";

interface FinishModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  initialServices: string[];
  allServices: ServiceItem[];
  onConfirm: (finalServices: string[]) => void;
}

export function FinishModal({
  isOpen,
  onClose,
  clientName,
  initialServices,
  allServices,
  onConfirm,
}: FinishModalProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedServices(initialServices);
    }
  }, [isOpen, initialServices]);

  if (!isOpen) return null;

  const toggleService = (serviceName: string) => {
    if (selectedServices.includes(serviceName)) {
      setSelectedServices((prev) => prev.filter((s) => s !== serviceName));
    } else {
      setSelectedServices((prev) => [...prev, serviceName]);
    }
  };

  const total = selectedServices.reduce((acc, name) => {
    const item = allServices.find((s) => s.name === name);
    return acc + (item?.price || 0);
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-4xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden ring-1 ring-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="p-8 pb-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-2xl font-bold text-slate-800">
            Finalizar Atendimento
          </h2>
          <p className="text-slate-500 mt-1">
            Cliente:{" "}
            <span className="font-bold text-slate-900">{clientName}</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Confirme os serviços realizados.
          </p>
        </div>

        <div className="p-8 overflow-y-auto max-h-[50vh] custom-scrollbar">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            O que foi feito?
          </label>

          <div className="flex flex-wrap gap-3">
            {allServices.map((service) => {
              const isSelected = selectedServices.includes(service.name);
              return (
                <button
                  key={service.id}
                  onClick={() => toggleService(service.name)}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all border shadow-sm
                    ${
                      isSelected
                        ? "bg-slate-800 text-white border-slate-800 shadow-slate-900/10 scale-105"
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }
                  `}
                >
                  <span>{service.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                      isSelected
                        ? "bg-slate-600 text-slate-200"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    R$ {service.price}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <div className="flex justify-between items-center mb-6 px-2">
            <span className="text-sm font-bold text-slate-500">
              Total a Receber
            </span>
            <span className="text-3xl font-black text-emerald-600">
              R$ {total.toFixed(2)}
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => onConfirm(selectedServices)}
              className="flex-2 py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <UserCheckIcon className="w-5 h-5" />
              Confirmar e Faturar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
