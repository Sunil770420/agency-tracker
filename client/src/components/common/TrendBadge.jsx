import { FaArrowTrendDown, FaArrowTrendUp } from 'react-icons/fa6';

const TrendBadge = ({ direction = 'neutral', percentage = 0 }) => {
  if (direction === 'neutral') {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
        0%
      </span>
    );
  }

  const isUp = direction === 'up';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
        isUp ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
      }`}
    >
      {isUp ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
      {percentage}%
    </span>
  );
};

export default TrendBadge;