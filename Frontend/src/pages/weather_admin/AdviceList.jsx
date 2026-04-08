import { motion } from "framer-motion";

export default function AdviceList({ advices, loading, onDelete }) {
  if (loading) return <div className="py-20 text-center animate-pulse text-stone-400">Loading advices...</div>;
  if (advices.length === 0) return <div className="py-20 text-center text-stone-500">No records found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-stone-50 border-b border-stone-200">
          <tr>
            <th className="px-6 py-4 font-bold text-stone-700">Advice Info</th>
            <th className="px-6 py-4 font-bold text-stone-700">Trigger Logic</th>
            <th className="px-6 py-4 font-bold text-stone-700">Priority/Severity</th>
            <th className="px-6 py-4 font-bold text-stone-700">Timing</th>
            <th className="px-6 py-4 text-right font-bold text-stone-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {advices.map((item) => (
            <motion.tr layout key={item._id} className="hover:bg-amber-50/10 transition-colors">
              <td className="px-6 py-4">
                <p className="font-bold text-stone-900">{item.title}</p>
                <p className="text-xs text-stone-500 line-clamp-1">{item.advice}</p>
                <span className="mt-2 inline-block rounded bg-stone-100 px-2 py-0.5 text-[10px] font-bold uppercase text-stone-600">
                  {item.category}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-xs">
                  <p className="font-bold text-stone-700">{item.trigger.parameter}</p>
                  <p className="text-stone-500 italic">
                    {item.trigger.conditionType === "RANGE" 
                      ? `${item.trigger.range.min ?? 'Any'} to ${item.trigger.range.max ?? 'Any'}`
                      : `Matches: ${item.trigger.exactValue}`}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${
                    item.severity === 'Moderate' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {item.severity}
                  </span>
                  <span className="text-[10px] text-stone-400 font-medium tracking-tighter">PRIORITY: {item.priority}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-xs text-stone-500">
                {item.timeStart ? `${item.timeStart} - ${item.timeEnd}` : "All Day"}
              </td>
              <td className="px-6 py-4 text-right space-x-3">
                <button className="text-amber-700 font-bold hover:underline">Edit</button>
                <button onClick={() => onDelete(item._id)} className="text-red-600 font-bold hover:underline">Delete</button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}