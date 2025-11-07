import { useState } from 'react';
import type { LibraryBook } from '../types';
import { libraryAPI } from '../services/api';
import BookCard from './BookCard';
import BookModal from './BookModal';
import './MyLibraryBooks.css';

interface MyLibraryBooksProps {
  books: LibraryBook[];
  statusFilter: string;
  onStatusFilterChange: (status: 'unread' | 'in-progress' | 'done' | '') => void;
  loading: boolean;
  onBookRemoved: () => void;
  onBookClick?: (bookId: string) => void; // ✅ Yeni prop
}

const MyLibraryBooks: React.FC<MyLibraryBooksProps> = ({
  books,
  statusFilter,
  onStatusFilterChange,
  loading,
  onBookRemoved,
  onBookClick,
}) => {
  const [selectedBook, setSelectedBook] = useState<LibraryBook | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookClick = (book: LibraryBook) => {
    if (onBookClick) {
      onBookClick(book._id); // ✅ Eğer prop verilmişse yönlendir
    } else {
      setSelectedBook(book); // Yoksa modal aç
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleDelete = async (bookId: string) => {
    if (window.confirm('Are you sure you want to remove this book from your library?')) {
      try {
        await libraryAPI.removeFromLibrary(bookId);
        onBookRemoved();
      } catch (error: any) {
        alert(error.response?.data?.message || 'Failed to remove book.');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading library...</div>;
  }

  return (
    <div className="my-library-books">
      <div className="library-header">
        <h1 className="page-title">My library</h1>
        <select
          className="status-filter"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as any)}
        >
          <option value="">All books</option>
          <option value="unread">Unread</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="books-grid">
        {books.length === 0 ? (
          <div className="empty-library">
            <p>
              To start training, <strong>add some of your books</strong> or <strong>from the recommended ones</strong>
            </p>
          </div>
        ) : (
          books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onClick={() => handleBookClick(book)}
              onDelete={() => handleDelete(book._id)}
              showDelete={true}
            />
          ))
        )}
      </div>

      {isModalOpen && selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={handleCloseModal}
          showStartReading={true}
        />
      )}
    </div>
  );
};

export default MyLibraryBooks;
