import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const GraficoLinha = ({ dados }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={dados}>
        <XAxis dataKey="nome" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="valor" stroke="#d97a0f" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default GraficoLinha;
