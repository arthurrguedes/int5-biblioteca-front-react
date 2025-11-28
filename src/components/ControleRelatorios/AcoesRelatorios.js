import styles from './relatorios.module.css';
import { exportarUsuarios, atualizarUsuarios } from '../../services/relatoriosService';

const AcoesRelatorio = () => {
  const atualizar = () => {
    console.log('Atualizar clicado');
    atualizarUsuarios()
      .then(data => {
        console.log("Relatório atualizado:", data);
        alert("Relatório atualizado com sucesso!");
        // Aqui você pode disparar um evento ou atualizar o estado global/contexto
      })
      .catch(err => console.error("Erro ao atualizar relatório:", err));
  };

  const exportar = () => {
    console.log('Exportar clicado');
    exportarUsuarios()
      .then(() => console.log("Exportação concluída"))
      .catch(err => console.error("Erro na exportação:", err));
  };

  return (
    <div className={styles.acoesContainer}>
      <button onClick={atualizar} className={styles.btnAtualizar}>
        Atualizar 🔄
      </button>
      <button onClick={exportar} className={styles.btnExportar}>
        Exportar 📤
      </button>
    </div>
  );
};

export default AcoesRelatorio;
