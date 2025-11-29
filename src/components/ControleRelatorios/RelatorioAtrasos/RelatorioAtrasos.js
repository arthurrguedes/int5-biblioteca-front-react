import { useState } from 'react';
import styles from './relatorio-atrasos.module.css';
import FiltrosRelatorio from '../FiltrosRelatorio';
import ContentBox from '../../ContentBox/ContentBox';
import AcoesRelatorio from '../AcoesRelatorios';
import GraficoBarra from '../../Graficos/GraficoBarra';
import GraficoPizza from '../../Graficos/GraficoPizza';
import Breadcrumb from '../../Breadcrumb/Breadcrumb'; 

const RelatorioAtrasos = () => {
  const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const anos = ['2021','2022','2023','2024','2025'];

  const [selectedMes, setSelectedMes] = useState('');
  const [selectedAno, setSelectedAno] = useState('');
  const [graficoSelecionado, setGraficoSelecionado] = useState('mes');

  const isBuscarEnabled = selectedMes !== '' || selectedAno !== '';

  const buscarRelatorio = () => {
    console.log('Buscar relatório de atrasos', selectedMes, selectedAno);
  };

  const renderGrafico = () => {
    switch (graficoSelecionado) {
      case 'mes':
        return <GraficoBarra dados={[{ nome: 'Janeiro', valor: 22 }, { nome: 'Fevereiro', valor: 18 } /* ... */]} />;
      case 'ano':
        return <GraficoBarra dados={[{ nome: '2021', valor: 180 }, { nome: '2022', valor: 195 } /* ... */]} />;
      case 'perfil':
        return <GraficoPizza dados={[{ nome: 'Alunos', valor: 180 }, { nome: 'Professores', valor: 40 }, { nome: 'Outros', valor: 10 }]} />;
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
          { label: 'Atrasos', path: '/relatorios/atrasos' }
        ]}
      />

      <h1 className={styles.pageTitle}>Relatório de Atrasos</h1>

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

      <ContentBox titulo="Atrasos">
        {renderGrafico()}

        <div className={styles.conteudoRelatorio}>
          <button className={styles.btnRelatorio} onClick={() => setGraficoSelecionado('mes')}>Atrasos por Mês</button>
          <button className={styles.btnRelatorio} onClick={() => setGraficoSelecionado('ano')}>Atrasos por Ano</button>
          <button className={styles.btnRelatorio} onClick={() => setGraficoSelecionado('perfil')}>Perfil dos Usuários</button>
        </div>
      </ContentBox>

      <AcoesRelatorio />
    </div>
  );
};

export default RelatorioAtrasos;
