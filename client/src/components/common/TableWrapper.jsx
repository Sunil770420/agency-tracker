const TableWrapper = ({ children }) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200">
      {children}
    </div>
  );
};

export default TableWrapper;