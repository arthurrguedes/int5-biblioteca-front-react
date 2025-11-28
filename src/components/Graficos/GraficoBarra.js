import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const GraficoBarra = ({ dados }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={dados}>
        <XAxis dataKey="nome" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="valor" fill="#4a2c82" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default GraficoBarra;
