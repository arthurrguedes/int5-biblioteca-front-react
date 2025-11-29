import { useState } from 'react';
import styles from './relatorio-multas.module.css';
import FiltrosRelatorio from '../FiltrosRelatorio';
import ContentBox from '../../ContentBox/ContentBox';
import AcoesRelatorio from '../AcoesRelatorios';
import GraficoBarra from '../../Graficos/GraficoBarra';
import GraficoPizza from '../../Graficos/GraficoPizza';
import Breadcrumb from '../../Breadcrumb/Breadcrumb'; 

const RelatorioMultas = () => {
  const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const anos = ['2021','2022','2023','2024','2025'];

  const [selectedMes, setSelectedMes] = useState('');
  const [selectedAno, setSelectedAno] = useState('');
  const [graficoSelecionado, setGraficoSelecionado] = useState('mes');

  const isBuscarEnabled = selectedMes !== '' || selectedAno !== '';

  const buscarRelatorio = () => {
    console.log('Buscar relatório de multas', selectedMes, selectedAno);
  };

  const renderGrafico = () => {
    switch (graficoSelecionado) {
      case 'mes':
        return <GraficoBarra dados={[{ nome: 'Janeiro', valor: 12 }, { nome: 'Fevereiro', valor: 8 }, { nome: 'Março', valor: 15 }]} />;
      case 'ano':
        return <GraficoBarra dados={[{ nome: '2023', valor: 120 }, { nome: '2024', valor: 95 }, { nome: '2025', valor: 110 }]} />;
      case 'tipo':
        return <GraficoPizza dados={[{ nome: 'Atraso', valor: 80 }, { nome: 'Dano ao livro', valor: 30 }, { nome: 'Perda', valor: 10 }]} />;
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
          { label: 'Multas', path: '/relatorios/multas' }
        ]}
      />

      <h1 className={styles.pageTitle}>Relatório de Multas</h1>

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

      <ContentBox titulo="Multas">
        {renderGrafico()}
        <div className={styles.conteudoRelatorio}>
          <button className={styles.btnRelatorio} onClick={() => setGraficoSelecionado('mes')}>Multas por Mês</button>
          <button className={styles.btnRelatorio} onClick={() => setGraficoSelecionado('ano')}>Multas por Ano</button>
          <button className={styles.btnRelatorio} onClick={() => setGraficoSelecionado('tipo')}>Tipos de Multas</button>
        </div>
      </ContentBox>

      <AcoesRelatorio />
    </div>
  );
};

export default RelatorioMultas;
