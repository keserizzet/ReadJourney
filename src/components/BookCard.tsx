// src/components/BookCard.tsx
import type { LibraryBook, RecommendedBook } from '../types';
import './BookCard.css';

interface BookCardProps {
  book: LibraryBook | RecommendedBook;
  onClick?: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick, onDelete, showDelete }) => {
  // 🔹 Görseli normalize et
  const imageSrc =
  (book as any).imageUrl || // ✅ Öncelik buraya
  (book as any).image_url ||
  (book as any).book_image ||
  (book as any).cover ||
  (() => {
    const images = JSON.parse(localStorage.getItem('bookImages') || '{}');
    return '_id' in book ? images[book._id] : undefined;
  })() ||
  '';

  return (
    <div className="book-card" onClick={onClick}>
      <div className="book-cover">
        {imageSrc ? (
          <img src={imageSrc} alt={book.title} className="book-image" />
        ) : (
          <div className="book-placeholder">
            {book.title.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="book-info">
        <h4>{book.title}</h4>
        <p>{book.author}</p>
        {showDelete && (
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;
