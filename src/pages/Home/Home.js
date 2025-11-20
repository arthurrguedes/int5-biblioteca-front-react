import React from 'react';
import styles from './Home.module.css';
import CategorySection from '../../components/CategorySection/CategorySection';
import bannerImage from '../../assets/banner.png';

const Home = () => {
  const categories = [
    { title: "Tecnologia", books: [] },
    { title: "Direito", books: [] },
    { title: "Romance", books: [] },
  ];

  return (
    <div className={styles.homeContainer}>
      <section className={styles.heroSection}>
        <img src={bannerImage} alt="Banner Biblioteca Plus" className={styles.bannerImage} />
      </section>
      
      <main className={styles.mainContent}>
        {categories.map((category, index) => (
          <CategorySection 
            key={index} 
            title={category.title} 
            books={category.books} 
          />
        ))}
      </main>
    </div>
  );
};

export default Home;