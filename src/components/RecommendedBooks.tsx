import { useState } from 'react';
import type { RecommendedBook } from '../types';
import BookCard from './BookCard';
import BookModal from './BookModal';
import './RecommendedBooks.css';

interface RecommendedBooksProps {
  books: RecommendedBook[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

const RecommendedBooks: React.FC<RecommendedBooksProps> = ({
  books,
  currentPage,
  totalPages,
  loading,
  onPageChange,
}) => {
  const [selectedBook, setSelectedBook] = useState<RecommendedBook | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookClick = (book: RecommendedBook) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  if (loading) {
    return <div className="loading">Loading books...</div>;
  }

  return (
    <div className="recommended-books">
      <h1 className="page-title">Recommended</h1>

      {books.length === 0 ? (
        <div className="empty-state">
          <p>No books found at the moment.</p>
          <p>Please check your connection or try again later.</p>
        </div>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onClick={() => handleBookClick(book)}
            />
          ))}
        </div>
      )}

      {books.length > 0 && (
        <div className="pagination">
        <button
          className="pagination-button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          ←
        </button>
        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="pagination-button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          →
        </button>
        </div>
      )}

      {isModalOpen && selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={handleCloseModal}
          showAddToLibrary={true}
        />
      )}
    </div>
  );
};

export default RecommendedBooks;

