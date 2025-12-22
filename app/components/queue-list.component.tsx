import type { Client } from "~/interfaces/client.interface";
import { ScissorIcon } from "./icons/scissor-icon.component";

export function QueueList({
  title,
  items,
}: {
  title: string;
  items: Client[];
}) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 w-full h-full flex flex-col">
      <h2 className="text-lg font-bold mb-6 text-gray-800 flex items-center gap-3 pl-2">
        <span className="p-2 bg-gray-100 text-gray-600 rounded-full">
          <ScissorIcon className="w-5 h-5" />
        </span>
        {title}
      </h2>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm">
            <p>Ninguém na fila.</p>
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-center gap-4 overflow-hidden">
                <span className="flex items-center justify-center w-10 h-10 min-w-10 bg-white text-gray-900 font-bold text-sm rounded-full shadow-sm">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <span className="block font-bold text-gray-700 truncate">
                    {item.name}
                  </span>
                  <span className="text-xs text-gray-500 font-medium bg-white px-2 py-1 rounded-full mt-1 inline-block border border-gray-100 truncate max-w-full">
                    {item.services.join(" + ")}
                  </span>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-400 whitespace-nowrap ml-2">
                {new Date(item.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
