import styles from './relatorios.module.css';

const FiltrosRelatorio = ({
  meses,
  anos,
  selectedMes,
  selectedAno,
  onMesChange,
  onAnoChange,
  isBuscarEnabled,
  onBuscarClick,
}) => {
  return (
    <div className={styles.filtros}>
      <div>
        <label htmlFor="mes">Mês</label>
        <select id="mes" value={selectedMes} onChange={(e) => onMesChange(e.target.value)}>
          <option value="">Selecione</option>
          {meses.map((mes) => (
            <option key={mes} value={mes}>{mes}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="ano">Ano</label>
        <select id="ano" value={selectedAno} onChange={(e) => onAnoChange(e.target.value)}>
          <option value="">Selecione</option>
          {anos.map((ano) => (
            <option key={ano} value={ano}>{ano}</option>
          ))}
        </select>
      </div>

      <button
        className={`${styles.btnBuscar} ${isBuscarEnabled ? styles.enabled : ''}`}
        disabled={!isBuscarEnabled}
        onClick={onBuscarClick}
      >
        Buscar 🔍
      </button>
    </div>
  );
};

export default FiltrosRelatorio;
