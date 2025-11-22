import React from 'react';
import styles from './SobreNos.module.css';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';

const SobreNos = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: '(usuário)', path: '#' },
    { label: 'Sobre Nós', path: '/sobre-nos' }
  ];

  return (
    <div className={styles.container}>
      <Breadcrumb items={breadcrumbItems} />
      
      <h1 className={styles.pageTitle}>Sobre Nós</h1>

      <p className={styles.description}>
        Somos uma biblioteca digital gratuita, criada para aproximar você da leitura, da cultura e do conhecimento, 
        esteja onde estiver. Nosso objetivo é facilitar o acesso, sempre com qualidade, diversidade e serviços 
        pensados para todos os perfis de leitor.
      </p>

      <div className={styles.offerCard}>
        <h2 className={styles.offerTitle}>O que oferecemos</h2>
        <ul className={styles.offerList}>
          <li className={styles.offerItem}>Acesso gratuito a milhares de livros digitais;</li>
          <li className={styles.offerItem}>Seleção de audiolivros, e-books e conteúdos multimídia;</li>
          <li className={styles.offerItem}>Aplicativo e plataforma responsiva para uso em qualquer dispositivo;</li>
          <li className={styles.offerItem}>Serviços de busca inteligente e histórico de leitura personalizado;</li>
          <li className={styles.offerItem}>Conteúdos atualizados continuamente com curadoria especializada.</li>
        </ul>
      </div>
    </div>
  );
};

export default SobreNos;