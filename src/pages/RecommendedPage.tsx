import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { booksAPI } from '../services/api';
import type { RecommendedBook, PaginationResponse } from '../types';
import Dashboard from '../components/Dashboard';
import RecommendedBooks from '../components/RecommendedBooks';
import Filters from '../components/Filters';
import './RecommendedPage.css';

const RecommendedPage: React.FC = () => {
  const [books, setBooks] = useState<RecommendedBook[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ title: '', author: '' });

  const loadBooks = async (page: number = 1, title?: string, author?: string) => {
    try {
      setLoading(true);
      const response: PaginationResponse<RecommendedBook> = await booksAPI.getRecommended(
        page,
        10,
        title,
        author
      );
      setBooks(response.books);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
    } catch (error: any) {
      console.error('Error loading books:', error);
      
      // Silently handle errors - don't show alerts to user
      // Empty books array will be shown instead
      if (error.response?.status === 401) {
        console.warn('Authentication error - token may be invalid or expired');
        // Don't show alert - just log it
      } else if (error.response?.status >= 500) {
        console.warn('Server error - please try again later');
        // Don't show alert - just log it
      } else {
        console.warn('Failed to load books:', error.response?.data?.message || error.message);
        // Don't show alert - empty state will be shown
      }
      
      // Set empty books array to prevent error state
      setBooks([]);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks(1, filters.title || undefined, filters.author || undefined);
  }, []);

  const handleFilterSubmit = (title: string, author: string) => {
    setFilters({ title, author });
    setCurrentPage(1);
    loadBooks(1, title || undefined, author || undefined);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadBooks(page, filters.title || undefined, filters.author || undefined);
  };

  return (
    <div className="recommended-page">
      <Dashboard>
        <Filters onSubmit={handleFilterSubmit} />
        
        <div className="start-workout">
          <h3 className="start-workout-title">Start your workout:</h3>
          <div className="workout-steps">
            <div className="workout-step">
              <div className="step-number">1</div>
              <p className="step-text">Create a personal library: add the books you intend to read to it.</p>
            </div>
            <div className="workout-step">
              <div className="step-number">2</div>
              <p className="step-text">Create your first workout: define a goal, choose a period, start training.</p>
            </div>
          </div>
          <Link to="/library" className="workout-link">My library</Link>
        </div>

        <div className="quote-block">
          <blockquote>
            "Books are windows to the world, and reading is a journey into the unknown."
          </blockquote>
        </div>
      </Dashboard>

      <RecommendedBooks
        books={books}
        currentPage={currentPage}
        totalPages={totalPages}
        loading={loading}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default RecommendedPage;

