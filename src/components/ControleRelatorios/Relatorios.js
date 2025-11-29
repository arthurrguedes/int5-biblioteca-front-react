import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './relatorios.module.css';
import FiltrosRelatorio from './FiltrosRelatorio';
import TiposRelatorio from './TiposRelatorio';
import ContentBox from '../ContentBox/ContentBox';
import Breadcrumb from '../Breadcrumb/Breadcrumb'; 

const Relatorios = () => {
  const navigate = useNavigate();

  const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const anos = ['2021','2022','2023','2024','2025'];
  const relatorios = ['RelatorioAtrasos','RelatorioEstoque','RelatorioLivros','RelatorioMultas','RelatorioUsuarios'];

  const [selectedMes, setSelectedMes] = useState('');
  const [selectedAno, setSelectedAno] = useState('');
  const [selectedRelatorio, setSelectedRelatorio] = useState(null);

  const isBuscarEnabled = selectedMes !== '' && selectedAno !== '';

  const buscarRelatorio = () => {
    console.log('Buscar relatório:', selectedMes, selectedAno, selectedRelatorio);
  };

  const handleSelectRelatorio = (tipo) => {
    setSelectedRelatorio(tipo);
    switch (tipo) {
      case 'RelatorioUsuarios': navigate('/relatorios/usuarios'); break;
      case 'RelatorioAtrasos': navigate('/relatorios/atrasos'); break;
      case 'RelatorioEstoque': navigate('/relatorios/estoque'); break;
      case 'RelatorioLivros': navigate('/relatorios/livros'); break;
      case 'RelatorioMultas': navigate('/relatorios/multas'); break;
      default: console.log(`Relatório ${tipo} ainda não implementado`);
    }
  };

  return (
    <div className={styles.relatoriosContainer}>
      
      <Breadcrumb 
        items={[
          { label: 'Home', path: '/' },
          { label: 'Relatórios', path: '/relatorios' }
        ]}
      />

      <h1 className={styles.pageTitle}>Meus Relatórios</h1>

      <div className={styles.filtersSection}>
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
      </div>

      <ContentBox titulo="Tipos de Relatório">
        <TiposRelatorio
          relatorios={relatorios}
          selectedRelatorio={selectedRelatorio || ''}
          onSelectRelatorio={(rel) => handleSelectRelatorio(rel)}
        />
      </ContentBox>
    </div>
  );
};

export default Relatorios;
