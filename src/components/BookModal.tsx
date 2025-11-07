// src/components/BookModal.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RecommendedBook, LibraryBook } from '../types';
import { libraryAPI } from '../services/api';
import './BookModal.css';

interface BookModalProps {
  book: RecommendedBook | LibraryBook;
  onClose: () => void;
  showAddToLibrary?: boolean;
  showStartReading?: boolean;
  onBookAdded?: () => void;
}

const BookModal: React.FC<BookModalProps> = ({
  book,
  onClose,
  showAddToLibrary = false,
  showStartReading = false,
  onBookAdded,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  // 🔹 Normalize edilmiş görsel alanı
  const imageSrc =
  (book as any).imageUrl ||
  (book as any).image_url ||
  (book as any).book_image ||
  (book as any).cover ||
  (() => {
    const images = JSON.parse(localStorage.getItem('bookImages') || '{}');
    return '_id' in book ? images[book._id] : undefined;
  })() ||
  '';

  // Kütüphaneye ekleme işlemi
  const handleAddToLibrary = async () => {
    try {
      if ('status' in book) {
        alert('📚 This book is already in your library.');
        return;
      }

      if (!book.title?.trim() || !book.author?.trim()) {
        alert('❌ Book title and author are required.');
        return;
      }

      await libraryAPI.addBook(
        book.title.trim(),
        book.author.trim(),
        book.totalPages,
        imageSrc // ✅ Görseli localStorage’a kaydediyoruz
      );

      alert('✅ Book added to library successfully!');
      onBookAdded?.();
      onClose();
    } catch (error: any) {
      if (error?.response?.status === 409) {
        onClose();
        return;
      }
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to add book to library.';
      alert(`❌ ${msg}`);
    }
  };

  const handleStartReading = () => {
    if ('_id' in book) navigate(`/reading/${book._id}`);
    else alert('⚠️ Please add this book to your library before reading.');
  };

  const isLibraryBook = 'status' in book;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="modal-body">
        <div className="modal-book-cover">
  {imageSrc ? (
    <img src={imageSrc} alt={book.title} className="book-cover-img" />
  ) : (
    <div className="book-placeholder">{book.title.charAt(0).toUpperCase()}</div>
  )}
</div>

          <div className="modal-book-info">
            <h2 className="modal-title">{book.title}</h2>
            <p className="modal-author">by {book.author}</p>
            <p className="modal-pages">Pages: {book.totalPages}</p>

            {showAddToLibrary && !isLibraryBook && (
              <button className="modal-action-button" onClick={handleAddToLibrary}>
                ➕ Add to library
              </button>
            )}

            {showStartReading && isLibraryBook && (
              <button className="modal-action-button" onClick={handleStartReading}>
                📖 Start reading
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal;
