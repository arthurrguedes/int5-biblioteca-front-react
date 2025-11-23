import React, {useState, useEffect} from 'react';
import styles from './Home.module.css';
import CategorySection from '../../components/CategorySection/CategorySection';
import bannerImage from '../../assets/banner.png';
import { bookService } from '../../services/bookService';

const Home = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const data = await bookService.getAllBooks();
      setBooks(data);
    };
    fetchBooks();
  }, []);
  
  const newReleases = books.slice(0, 10); 
  const mostReserved = books.slice(10, 20);

  const categories = [
    { title: "Novos Lançamentos", books: newReleases },
    { title: "Destaques do Acervo", books: mostReserved },
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