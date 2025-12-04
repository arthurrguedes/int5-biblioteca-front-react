import styles from './Content-box.module.css'; 

const ContentBox = ({ titulo, children }) => {
  return (
    <div className={styles.contentBox}>
      <div className={styles.contentBoxTitle}>{titulo}</div>
      <div className={styles.contentBoxBody}>{children}</div>
    </div>
  );
};

export default ContentBox;
