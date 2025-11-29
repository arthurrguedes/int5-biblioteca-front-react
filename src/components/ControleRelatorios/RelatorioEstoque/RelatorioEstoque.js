import { useState } from 'react';
import styles from './relatorio-estoque.module.css';
import FiltrosRelatorio from '../FiltrosRelatorio';
import ContentBox from '../../ContentBox/ContentBox';
import AcoesRelatorio from '../AcoesRelatorios';
import GraficoBarra from '../../Graficos/GraficoBarra';
import GraficoPizza from '../../Graficos/GraficoPizza';
import Breadcrumb from '../../Breadcrumb/Breadcrumb'; 

const RelatorioEstoque = () => {
  const anos = ['2021', '2022', '2023', '2024', '2025'];

  const [selectedAno, setSelectedAno] = useState('');
  const [graficoSelecionado, setGraficoSelecionado] = useState('quantidade');

  const isBuscarEnabled = selectedAno !== '';

  const buscarRelatorio = () => {
    console.log('Buscar relatório de estoque', selectedAno);
  };

  const renderGrafico = () => {
    switch (graficoSelecionado) {
      case 'quantidade':
        return (
          <GraficoBarra
            dados={[
              { nome: 'Total de Livros', valor: 1200 },
              { nome: 'Disponíveis', valor: 950 },
              { nome: 'Emprestados', valor: 250 }
            ]}
          />
        );
      case 'categoria':
        return (
          <GraficoPizza
            dados={[
              { nome: 'Ficção', valor: 500 },
              { nome: 'Técnico', valor: 300 },
              { nome: 'Infantil', valor: 400 }
            ]}
          />
        );
      case 'ano':
        return (
          <GraficoBarra
            dados={[
              { nome: '2023', valor: 1100 },
              { nome: '2024', valor: 1200 },
              { nome: '2025', valor: 1250 }
            ]}
          />
        );
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
          { label: 'Estoque', path: '/relatorios/estoque' }
        ]}
      />

      <h1 className={styles.pageTitle}>Relatório de Estoque</h1>

      <FiltrosRelatorio
        meses={[]} // Estoque não precisa de filtro por mês
        anos={anos}
        selectedMes=""
        selectedAno={selectedAno}
        onMesChange={() => {}}
        onAnoChange={setSelectedAno}
        isBuscarEnabled={isBuscarEnabled}
        onBuscarClick={buscarRelatorio}
      />

      <ContentBox titulo="Estoque">
        {renderGrafico()}
        <div className={styles.conteudoRelatorio}>
          <button
            className={styles.btnRelatorio}
            onClick={() => setGraficoSelecionado('quantidade')}
          >
            Resumo de Estoque
          </button>
          <button
            className={styles.btnRelatorio}
            onClick={() => setGraficoSelecionado('categoria')}
          >
            Por Categoria
          </button>
          <button
            className={styles.btnRelatorio}
            onClick={() => setGraficoSelecionado('ano')}
          >
            Estoque por Ano
          </button>
        </div>
      </ContentBox>

      <AcoesRelatorio />
    </div>
  );
};

export default RelatorioEstoque;
