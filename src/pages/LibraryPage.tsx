// src/pages/LibraryPage.tsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { libraryAPI, booksAPI } from '../services/api';
import type { LibraryBook, RecommendedBook } from '../types';
import Dashboard from '../components/Dashboard';
import MyLibraryBooks from '../components/MyLibraryBooks';
import AddBookForm from '../components/AddBookForm';
import BookCard from '../components/BookCard';
import './LibraryPage.css';

const LibraryPage: React.FC = () => {
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<RecommendedBook[]>([]);
  const [statusFilter, setStatusFilter] = useState<'unread' | 'in-progress' | 'done' | ''>('');
  const [loading, setLoading] = useState(true);

  const loadBooks = async (status?: 'unread' | 'in-progress' | 'done') => {
    try {
      setLoading(true);
      const data = await libraryAPI.getLibrary(status);
      setBooks(status ? data.filter((b) => b.status === status) : data);
    } catch (error) {
      console.error('❌ Error loading library:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendedBooks = async () => {
    try {
      const response = await booksAPI.getRecommended(1, 3);
      setRecommendedBooks(response.books.slice(0, 3));
    } catch (error) {
      console.error('❌ Error loading recommended books:', error);
      setRecommendedBooks([]);
    }
  };

  useEffect(() => {
    loadBooks(statusFilter || undefined);
    loadRecommendedBooks();
  }, [statusFilter]);

  const handleBookAdded = () => loadBooks(statusFilter || undefined);
  const handleBookRemoved = () => loadBooks(statusFilter || undefined);

  return (
    <div className="library-page">
      <Dashboard>
        <AddBookForm onBookAdded={handleBookAdded} />

        <div className="dashboard-section">
          <h3 className="dashboard-section-title">Recommended books</h3>
          <div className="recommended-books-grid">
            {recommendedBooks.length > 0 ? (
              recommendedBooks.map((book) => {
                // 🔹 Görseli normalize et (bazı API’lerde farklı adlarla gelebiliyor)
                const imageUrl =
                  (book as any).imageUrl ||
                  (book as any).image_url ||
                  (book as any).book_image ||
                  (book as any).cover ||
                  '';

                return (
                  <BookCard
                    key={book._id}
                    book={book}
                    onClick={() => {
                      libraryAPI
                        .addBook(book.title, book.author, book.totalPages, imageUrl)
                        .then(() => {
                          handleBookAdded();
                          alert('✅ Book added to library successfully!');
                        })
                        .catch((err) => {
                          console.error('Failed to add book:', err);
                          if (err.response?.status === 409) {
                            alert('📚 This book is already in your library!');
                          } else {
                            alert(err.response?.data?.message || 'Failed to add book.');
                          }
                        });
                    }}
                  />
                );
              })
            ) : (
              <p>No recommended books available.</p>
            )}
          </div>
          <Link to="/recommended" className="workout-link">
            Home
          </Link>
        </div>
      </Dashboard>

      <MyLibraryBooks
        books={books}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        loading={loading}
        onBookRemoved={handleBookRemoved}
      />
    </div>
  );
};

export default LibraryPage;
