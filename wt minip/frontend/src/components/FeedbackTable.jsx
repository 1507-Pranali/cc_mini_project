function FeedbackTable({ feedback, onDelete, showDelete = false, emptyMessage = "No feedback available." }) {
  return (
    <div className="panel-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-slate-100/80 dark:bg-slate-900/60">
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Teacher</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Comment</th>
              <th className="px-4 py-3">Date</th>
              {showDelete ? <th className="px-4 py-3">Actions</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {feedback.length ? (
              feedback.map((item) => (
                <tr key={item.id} className="hover:bg-brand-50/60 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-4 text-sm">{item.student_name}</td>
                  <td className="px-4 py-4 text-sm">{item.course}</td>
                  <td className="px-4 py-4 text-sm">{item.teacher}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-amber-500">{item.rating} / 5</td>
                  <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{item.comment}</td>
                  <td className="px-4 py-4 text-sm">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  {showDelete ? (
                    <td className="px-4 py-4 text-sm">
                      <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        className="rounded-lg bg-rose-500 px-3 py-2 font-semibold text-white transition hover:bg-rose-400"
                      >
                        Delete
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={showDelete ? 7 : 6} className="px-4 py-8 text-center text-sm text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FeedbackTable;
