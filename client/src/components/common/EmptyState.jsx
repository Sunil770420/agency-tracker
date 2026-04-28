const EmptyState = ({ title = 'No data found', message = 'Data add karne ke baad yaha show hoga.' }) => {
  return (
    <div className="flex min-h-[180px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <div>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
          📭
        </div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">{message}</p>
      </div>
    </div>
  );
};

export default EmptyState;