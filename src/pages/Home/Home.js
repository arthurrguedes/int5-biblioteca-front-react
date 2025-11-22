import React from 'react';
import styles from './Home.module.css';
import CategorySection from '../../components/CategorySection/CategorySection';
import bannerImage from '../../assets/banner.png';

// Dados Mockados (Copiados do Catálogo para simular o banco de dados compartilhado)
const MOCK_BOOKS = [
  { id: 1, title: 'Gestão de recursos humanos: teorias e reflexões', author: 'Kelly Cesar', category: 'Humor', isbn: '978852703857', edition: '1ª (2018)', pages: 272 },
  { id: 2, title: 'O Guia do Mochileiro das Galáxias', author: 'Douglas Adams', category: 'Ficção Científica', isbn: '1234567890123', edition: 'Edição 10', pages: 300 },
  { id: 3, title: 'A Culpa é das Estrelas', author: 'John Green', category: 'Romance', isbn: '9876543210987', edition: 'Edição 5', pages: 280 },
  { id: 4, title: 'Código Limpo', author: 'Robert C. Martin', category: 'Tecnologia', isbn: '1122334455667', edition: 'Edição 1', pages: 464 },
  { id: 5, title: 'Use a Cabeça! Java', author: 'Kathy Sierra', category: 'Tecnologia', isbn: '5544332211009', edition: 'Edição 2', pages: 688 },
  { id: 6, title: 'O Poder do Hábito', author: 'Charles Duhigg', category: 'Autoajuda', isbn: '1111111111111', edition: 'Edição 3', pages: 400 },
  { id: 7, title: 'It: A Coisa', author: 'Stephen King', category: 'Terror', isbn: '2222222222222', edition: 'Edição 4', pages: 1138 },
  { id: 8, title: 'A Semente do Amanhã', author: 'Roberto C. Martin', category: 'Tecnologia', isbn: '3333333333333', edition: 'Edição 1', pages: 200 },
  { id: 9, title: 'Misterio no Expresso Oriente', author: 'Agatha Christie', category: 'Mistério', isbn: '4444444444444', edition: 'Edição 1', pages: 350 },
  { id: 10, title: 'O Senhor dos Anéis', author: 'J.R.R. Tolkien', category: 'Fantasia', isbn: '5555555555555', edition: 'Edição 1', pages: 1200 },
  { id: 11, title: 'Piquenique na Relva', author: 'Autor Hilario', category: 'Humor', isbn: '6666666666666', edition: 'Edição 2', pages: 150 },
  { id: 12, title: 'O Monge e o Executivo', author: 'James C. Hunter', category: 'Autoajuda', isbn: '7777777777777', edition: 'Edição 1', pages: 180 },
  { id: 13, title: 'O Labirinto do Fauno', author: 'Guillermo del Toro', category: 'Fantasia', isbn: '8888888888888', edition: 'Edição 1', pages: 250 },
];

const Home = () => {
  // Selecionando livros específicos para cada seção (simulação)
  
  // Ex: Últimos livros adicionados (IDs mais altos)
  const newReleases = MOCK_BOOKS.filter(book => [13, 10, 2, 8].includes(book.id));
  
  // Ex: Livros populares
  const mostReserved = MOCK_BOOKS.filter(book => [3, 7, 4, 6].includes(book.id));
  
  // Ex: Clássicos ou técnicos
  const mostSearched = MOCK_BOOKS.filter(book => [5, 9, 1, 12].includes(book.id));

  const categories = [
    { title: "Novos Lançamentos", books: newReleases },
    { title: "Mais Reservados", books: mostReserved },
    { title: "Mais Procurados", books: mostSearched },
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