import { useState } from 'react';
import styles from './relatorio-livros.module.css';
import FiltrosRelatorio from '../FiltrosRelatorio';
import ContentBox from '../../ContentBox/ContentBox';
import AcoesRelatorio from '../AcoesRelatorios';
import GraficoBarra from '../../Graficos/GraficoBarra';
import GraficoPizza from '../../Graficos/GraficoPizza';
import Breadcrumb from '../../Breadcrumb/Breadcrumb'; 

const RelatorioLivros = () => {
  const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const anos = ['2021','2022','2023','2024','2025'];

  const [selectedMes, setSelectedMes] = useState('');
  const [selectedAno, setSelectedAno] = useState('');
  const [graficoSelecionado, setGraficoSelecionado] = useState('mes');

  const isBuscarEnabled = selectedMes !== '' || selectedAno !== '';

  const buscarRelatorio = () => {
    console.log('Buscar relatório de livros', selectedMes, selectedAno);
  };

  const renderGrafico = () => {
    switch (graficoSelecionado) {
      case 'mes':
        return <GraficoBarra dados={[{ nome: 'Janeiro', valor: 45 }, { nome: 'Fevereiro', valor: 38 } /* ... */]} />;
      case 'ano':
        return <GraficoBarra dados={[{ nome: '2021', valor: 480 }, { nome: '2022', valor: 520 } /* ... */]} />;
      case 'categoria':
        return <GraficoPizza dados={[{ nome: 'Ficção', valor: 220 }, { nome: 'Não Ficção', valor: 180 }, { nome: 'Técnico', valor: 90 }, { nome: 'Infantil', valor: 110 }]} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.relatoriosContainer}>
      {/* 👇 Breadcrumb aqui */}
      <Breadcrumb 
        items={[
          { label: 'Home', path: '/' },
          { label: 'Relatórios', path: '/relatorios' },
          { label: 'Livros', path: '/relatorios/livros' }
        ]}
      />

      <h1 className={styles.pageTitle}>Relatório de Livros</h1>

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

      <ContentBox titulo="Livros">
        {renderGrafico()}

        <div className={styles.conteudoRelatorio}>
          <button className={styles.btnRelatorio} onClick={() => setGraficoSelecionado('mes')}>Empréstimos por Mês</button>
          <button className={styles.btnRelatorio} onClick={() => setGraficoSelecionado('ano')}>Empréstimos por Ano</button>
          <button className={styles.btnRelatorio} onClick={() => setGraficoSelecionado('categoria')}>Categorias de Livros</button>
        </div>
      </ContentBox>

      <AcoesRelatorio />
    </div>
  );
};

export default RelatorioLivros;
