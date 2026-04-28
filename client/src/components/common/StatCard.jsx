import TrendBadge from './TrendBadge';

const StatCard = ({ title, value, subtitle, trend }) => {
  return (
    <div className="safe-card rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-500 sm:text-sm">{title}</p>
          <h3 className="break-safe mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {value}
          </h3>
        </div>

        <div className="self-start">
          <TrendBadge
            direction={trend?.direction}
            percentage={trend?.percentage}
          />
        </div>
      </div>

      {subtitle ? (
        <p className="break-safe text-xs text-slate-500 sm:text-sm">{subtitle}</p>
      ) : null}
    </div>
  );
};

export default StatCard;