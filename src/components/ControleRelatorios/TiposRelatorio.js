import styles from './relatorios.module.css';

const TiposRelatorio = ({ relatorios, selectedRelatorio, onSelectRelatorio }) => {
  return (
    <div className={styles.botoes}>
      {relatorios.map((rel) => (
        <button
          key={rel}
          className={`${styles.relBtn} ${selectedRelatorio === rel ? styles.selected : ''}`}
          onClick={() => onSelectRelatorio(rel)}
        >
          {rel}
        </button>
      ))}
    </div>
  );
};

export default TiposRelatorio;
