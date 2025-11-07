// src/pages/ReadingPage.tsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { readingAPI, libraryAPI } from '../services/api';
import type { LibraryBook, ReadingSession } from '../types';
import Dashboard from '../components/Dashboard';
import AddReadingForm from '../components/AddReadingForm';
import MyBook from '../components/MyBook';
import './ReadingPage.css';

const ReadingPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<LibraryBook | null>(null);
  const [sessions, setSessions] = useState<ReadingSession[]>([]);
  const [progress, setProgress] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true; // ekle
    return () => {
      alive.current = false;
    };
  }, []);
  

  const computeIsReading = (list: ReadingSession[]) =>
    list.some((s) => s?.status === 'active' || !s?.finishReadingTime);

  useEffect(() => {
    if (!bookId) {
      navigate('/library');
      return;
    }
  
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const libraryBooks = await libraryAPI.getLibrary();
        const currentBook = libraryBooks.find((b) => b._id === bookId) || null;
  
        if (!currentBook) {
          setError('Book not found in your library.');
          navigate('/library');
          return;
        }
  
        let stats: { sessions: ReadingSession[]; progress: number } = { sessions: [], progress: 0 };
        try {
          stats = await readingAPI.getReadingStats(bookId);
        } catch (innerErr) {
          console.warn('⚠️ Could not load reading stats:', innerErr);
        }
  
        if (!alive.current) return;
  
        setBook(currentBook);
        setSessions(stats.sessions || []);
        setProgress(stats.progress || 0);
        setIsReading(computeIsReading(stats.sessions || []));
      } catch (err) {
        console.error('❌ Error loading book:', err);
        if (!alive.current) return;
        setError('Failed to load book data.');
      } finally {
        if (alive.current) {
          console.log('✅ Loading stopped.');
          setLoading(false);
        }
      }
    };
  
    load();
  }, [bookId, navigate]);
  

  const refreshStats = async (id: string) => {
    try {
      const stats = await readingAPI.getReadingStats(id);
      if (!alive.current) return;
      setSessions(stats.sessions);
      setProgress(stats.progress);
      setIsReading(computeIsReading(stats.sessions));
    } catch (error) {
      console.error('Error refreshing stats:', error);
    }
  };

  const handleStartReading = async (startPage: number) => {
    if (!bookId) return;
    try {
      await readingAPI.startReading(bookId, startPage);
      await refreshStats(bookId);
      alert('📖 Reading session started!');
    } catch (error) {
      console.error(error);
      alert('Failed to start reading. Try again.');
    }
  };

  const handleFinishReading = async (finishPage: number) => {
    if (!bookId || !book) return;
    try {
      await readingAPI.finishReading(bookId, finishPage);
      await refreshStats(bookId);
      if (finishPage >= (book.totalPages || 0)) {
        alert('🎉 Congratulations! You finished this book!');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to finish reading.');
    }
  };

  const handleSessionDelete = async (sessionId: string) => {
    if (!bookId) return;
    try {
      await readingAPI.deleteSession(sessionId);
      await refreshStats(bookId);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!book) return <div className="error">No book found.</div>;

  return (
    <div className="reading-page">
      <Dashboard>
        <AddReadingForm
          isReading={isReading}
          onStart={handleStartReading}
          onFinish={handleFinishReading}
        />
      </Dashboard>

      <MyBook
        book={book}
        sessions={sessions}
        progress={progress}
        isReading={isReading}
        onSessionDelete={handleSessionDelete}
      />
    </div>
  );
};

export default ReadingPage;
