import { ArrowLeft, Construction, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ComingSoon({ title, subtitle }) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-950 text-white shadow-lg dark:bg-white dark:text-slate-950">
          <Construction className="h-10 w-10" />
        </div>

        <div className="mt-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-blue-700">
            <Sparkles className="h-3.5 w-3.5" />
            Module Coming Soon
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-extrabold text-slate-950 dark:text-white">
          {title}
        </h1>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default ComingSoon;