import { useState } from "react";
import { useServices } from "~/hooks/use-services.hook";

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ServicesModal({ isOpen, onClose }: ServicesModalProps) {
  const { services, addService, deleteService } = useServices();

  // Estado do formulário
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("30");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    addService(name, Number(price), Number(duration));

    // Limpar form
    setName("");
    setPrice("");
    setDuration("30");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden ring-1 ring-slate-100 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">
            Gerenciar Serviços
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Adicione ou remova serviços e preços.
          </p>
        </div>

        {/* Lista de Serviços Existentes */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
          {services.length === 0 ? (
            <p className="text-center text-slate-400 text-sm">
              Nenhum serviço cadastrado.
            </p>
          ) : (
            services.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group"
              >
                <div>
                  <h3 className="font-bold text-slate-800">{service.name}</h3>
                  <div className="text-xs text-slate-500 flex gap-2">
                    <span>R$ {service.price.toFixed(2)}</span>
                    <span>•</span>
                    <span>{service.duration} min</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteService(service.id)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Excluir"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Formulário de Adição */}
        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Adicionar Novo
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Nome do Serviço (ex: Corte)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Preço (R$)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-1/2 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              <input
                type="number"
                placeholder="Tempo (min)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-1/2 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all mt-2"
            >
              Adicionar
            </button>
          </form>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
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
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
