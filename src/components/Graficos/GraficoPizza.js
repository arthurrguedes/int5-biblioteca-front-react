import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const cores = ['#4a2c82', '#d97a0f', '#28a745'];

const GraficoPizza = ({ dados }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={dados}
          dataKey="valor"
          nameKey="nome"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {dados.map((_, index) => (
            <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default GraficoPizza;
