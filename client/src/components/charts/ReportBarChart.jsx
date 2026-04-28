import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from 'recharts';

const ReportBarChart = ({ data }) => {
  return (
    <div className="h-[340px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="metaSpend" name="Meta Spend" radius={[8, 8, 0, 0]} />
          <Bar dataKey="googleSpend" name="Google Spend" radius={[8, 8, 0, 0]} />
          <Bar dataKey="conversions" name="Conversions" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportBarChart;