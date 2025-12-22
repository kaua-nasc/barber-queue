export function CurrentPositionStatus({
  position,
  onLeave,
  barberName,
}: {
  position: number;
  onLeave: () => void;
  barberName: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-white">
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-gray-100 rounded-full animate-pulse"></div>
        <div className="w-56 h-56 rounded-full bg-white border-8 border-gray-50 flex flex-col items-center justify-center relative z-10 shadow-lg">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
            Sua vez
          </span>
          <span className="text-7xl font-bold text-gray-800 tracking-tight">
            {position}º
          </span>
          <span className="mt-2 text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
            Aguardando
          </span>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-2">Tudo certo!</h3>
      <p className="text-gray-500 mb-8 max-w-sm">
        Aguarde, assim que o {barberName} chamar, dirija-se à cadeira.
      </p>

      <button
        onClick={onLeave}
        className="text-gray-400 hover:text-red-500 text-sm font-medium px-6 py-2 rounded-full hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
      >
        Sair da fila
      </button>
    </div>
  );
}
