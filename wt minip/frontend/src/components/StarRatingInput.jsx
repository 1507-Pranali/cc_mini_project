import { Star } from "lucide-react";


function StarRatingInput({ value, onChange }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
      <p className="mb-3 text-sm font-medium text-slate-600 dark:text-slate-300">Select rating</p>
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((starValue) => {
          const active = starValue <= value;
          return (
            <button
              key={starValue}
              type="button"
              onClick={() => onChange(starValue)}
              className={`rounded-2xl border px-3 py-2 transition ${
                active
                  ? "border-amber-300 bg-amber-50 text-amber-500 dark:border-amber-500/40 dark:bg-amber-500/10"
                  : "border-slate-200 bg-white text-slate-400 hover:border-brand-400 hover:text-brand-500 dark:border-slate-800 dark:bg-slate-950"
              }`}
            >
              <span className="flex items-center gap-2">
                <Star size={16} fill={active ? "currentColor" : "none"} />
                {starValue}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default StarRatingInput;
