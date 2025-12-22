import { useState } from "react";
import { ScissorIcon } from "./icons/scissor-icon.component";
import { UserCheckIcon } from "./icons/user-check-icon.component";
import type { ServiceItem } from "~/hooks/use-services.hook";

interface JoinQueuePromptProps {
  onJoin: (name: string, services: string[]) => void;
  queueSize: number;
  availableServices: ServiceItem[];
}

export function JoinQueuePrompt({
  onJoin,
  queueSize,
  availableServices,
}: JoinQueuePromptProps) {
  const [name, setName] = useState("");

  // Armazenamos o objeto inteiro para poder somar o preço facilmente
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);

  const toggleService = (service: ServiceItem) => {
    // Verifica se já está na lista comparando o ID
    const isAlreadySelected = selectedServices.some((s) => s.id === service.id);

    if (isAlreadySelected) {
      setSelectedServices((prev) => prev.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices((prev) => [...prev, service]);
    }
  };

  const handleConfirm = () => {
    if (name.trim() && selectedServices.length > 0) {
      // Passa apenas os nomes conforme sua interface original pede
      onJoin(
        name,
        selectedServices.map((s) => s.name)
      );
    }
  };

  // Calcula o total
  const totalPrice = selectedServices.reduce(
    (acc, curr) => acc + curr.price,
    0
  );

  const isValid = name.length > 2 && selectedServices.length > 0;

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 md:p-8 overflow-y-auto custom-scrollbar relative">
      {/* Ícone de Topo */}
      <div className="mb-6 p-4 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
        <ScissorIcon className="w-8 h-8 text-slate-700" />
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">
        Entrar na Fila
      </h2>
      <p className="text-slate-400 max-w-xs mx-auto mb-8 text-sm font-medium">
        Informe seu nome e escolha os serviços.
      </p>

      {/* Input de Nome */}
      <div className="w-full max-w-sm mb-6 text-left">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
          Seu Nome
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Ex: João Silva"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-semibold text-slate-800 placeholder-slate-300 shadow-sm"
          />
          {name.length > 0 && name.length < 3 && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-red-400 font-bold">
              Muito curto
            </span>
          )}
        </div>
      </div>

      {/* Seleção de Serviços */}
      <div className="w-full max-w-sm mb-8 text-left">
        <div className="flex justify-between items-end mb-3 ml-1">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
            Serviços
          </label>
          {totalPrice > 0 && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              Total: R$ {totalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5">
          {availableServices.length === 0 ? (
            <div className="w-full text-center p-4 border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
              Nenhum serviço cadastrado pelo barbeiro.
            </div>
          ) : (
            availableServices.map((service) => {
              const isSelected = selectedServices.some(
                (s) => s.id === service.id
              );
              return (
                <button
                  key={service.id}
                  onClick={() => toggleService(service)}
                  className={`
                        group relative flex items-center gap-2 pl-4 pr-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border shadow-sm
                        ${
                          isSelected
                            ? "bg-slate-800 text-white border-slate-800 shadow-lg shadow-slate-900/10 -translate-y-px"
                            : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }
                    `}
                >
                  <span>{service.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                      isSelected
                        ? "bg-slate-700 text-slate-200"
                        : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                    }`}
                  >
                    R$ {service.price}
                  </span>

                  {/* Indicador de Seleção (Check) */}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      <button
        onClick={handleConfirm}
        disabled={!isValid}
        className={`w-full max-w-xs py-4 font-bold rounded-xl shadow-xl transition-all flex items-center justify-center gap-3 ${
          isValid
            ? "bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-500 hover:-translate-y-1 cursor-pointer"
            : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none border border-slate-200"
        }`}
      >
        <UserCheckIcon className="w-5 h-5" />
        {isValid ? "Confirmar Entrada" : "Preencha os dados"}
      </button>

      <div className="mt-6 flex items-center gap-2 text-xs text-slate-400 font-medium bg-slate-50 px-3 py-1.5 rounded-full">
        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
        {queueSize === 0
          ? "Fila vazia, você será o próximo!"
          : `${queueSize} pessoas na sua frente`}
      </div>
    </div>
  );
}
