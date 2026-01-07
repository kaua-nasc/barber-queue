import { useNotice } from "~/hooks/use-notice.hook";

const STYLES = {
  info: {
    container: "bg-blue-50 border-blue-100 text-blue-800",
    icon: (
      <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  alert: {
    container: "bg-amber-50 border-amber-100 text-amber-800",
    icon: (
      <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    )
  },
  success: {
    container: "bg-emerald-50 border-emerald-100 text-emerald-800",
    icon: (
      <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
};

export function NoticeBanner() {
  const { notice, loading } = useNotice();

  if (loading || !notice.isVisible || !notice.message) return null;

  const style = STYLES[notice.type] || STYLES.info;

  return (
    <div className={`mb-6 p-4 rounded-2xl border ${style.container} shadow-sm flex items-start gap-3 animate-fade-in`}>
      <div className="shrink-0 mt-0.5">
        {style.icon}
      </div>
      <div>
        <h3 className="font-bold text-sm uppercase tracking-wide opacity-80 mb-0.5">
          {notice.type === 'alert' ? 'Importante' : notice.type === 'success' ? 'Novidade' : 'Aviso'}
        </h3>
        <p className="font-medium text-sm leading-relaxed whitespace-pre-wrap">
          {notice.message}
        </p>
      </div>
    </div>
  );
}