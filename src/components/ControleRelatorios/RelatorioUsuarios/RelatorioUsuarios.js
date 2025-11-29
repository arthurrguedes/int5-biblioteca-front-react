import { useState, useEffect } from 'react';
import styles from './relatorio-usuarios.module.css';
import FiltrosRelatorio from '../FiltrosRelatorio';
import ContentBox from '../../ContentBox/ContentBox';
import AcoesRelatorio from '../AcoesRelatorios';
import GraficoBarra from '../../Graficos/GraficoBarra';
import GraficoPizza from '../../Graficos/GraficoPizza';
import Breadcrumb from '../../Breadcrumb/Breadcrumb'; 
import { getTiposUsuarios, getUsuariosPorMes } from '../../../services/relatoriosService';

const RelatorioUsuarios = () => {
  const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const anos = ['2021','2022','2023','2024','2025'];

  const [selectedMes, setSelectedMes] = useState('');
  const [selectedAno, setSelectedAno] = useState('');
  const [graficoSelecionado, setGraficoSelecionado] = useState('mes');
  const [dadosDistribuicao, setDadosDistribuicao] = useState([]);
  const [dadosUsuariosMes, setDadosUsuariosMes] = useState([]);

  const isBuscarEnabled = selectedMes !== '' || selectedAno !== '';

  const buscarRelatorio = () => {
    console.log('Buscar relatório de usuários', selectedMes, selectedAno);
  };

  useEffect(() => {
    if (graficoSelecionado === 'distribuicao') {
      getTiposUsuarios()
        .then(data => setDadosDistribuicao(data))
        .catch(err => console.error('Erro ao buscar distribuição de usuários:', err));
    }
    if (graficoSelecionado === 'mes') {
      getUsuariosPorMes()
        .then(data => setDadosUsuariosMes(data))
        .catch(err => console.error('Erro ao buscar usuários por mês:', err));
    }
  }, [graficoSelecionado]);

  const renderGrafico = () => {
    switch (graficoSelecionado) {
      case 'mes':
        return <GraficoBarra dados={dadosUsuariosMes} />;
      case 'ano':
        return <GraficoBarra dados={[{ nome: '2021', valor: 80 }, { nome: '2022', valor: 95 }, { nome: '2023', valor: 60 }, { nome: '2024', valor: 90 }, { nome: '2025', valor: 55 }]} />;
      case 'pizza':
        return <GraficoPizza dados={[{ nome: 'Professores', valor: 40 }, { nome: 'Alunos', valor: 120 }, { nome: 'Outros', valor: 20 }]} />;
      case 'distribuicao':
        return <GraficoPizza dados={dadosDistribuicao} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.relatoriosContainer}>
      <Breadcrumb 
        items={[
          { label: 'Home', path: '/' },
          { label: 'Relatórios', path: '/relatorios' },
          { label: 'Usuários', path: '/relatorios/usuarios' }
        ]}
      />

      <h1 className={styles.pageTitle}>Relatório de Usuários</h1>

      <FiltrosRelatorio
        meses={meses}
        anos={anos}
        selectedMes={selectedMes}
        selectedAno={selectedAno}
        onMesChange={setSelectedMes}
        onAnoChange={setSelectedAno}
        isBuscarEnabled={isBuscarEnabled}
        onBuscarClick={buscarRelatorio}
      />

      <ContentBox titulo="Usuários">
        {renderGrafico()}

        <div className={styles.conteudoRelatorio}>
          <button className={styles.btnRelatorio} onClick={() => setGraficoSelecionado('mes')}>Usuários por Mês</button>
          <button className={styles.btnRelatorio} onClick={() => setGraficoSelecionado('ano')}>Usuários por Ano</button>
          <button className={styles.btnRelatorio} onClick={() => setGraficoSelecionado('pizza')}>Tipos de Usuários</button>
          <button className={styles.btnRelatorio} onClick={() => setGraficoSelecionado('distribuicao')}>Usuários vs Bibliotecários</button>
        </div>
      </ContentBox>

      <AcoesRelatorio />
    </div>
  );
};

export default RelatorioUsuarios;
