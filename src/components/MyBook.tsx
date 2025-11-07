import { useState } from 'react';
import type { LibraryBook, ReadingSession } from '../types';
import Diary from './Diary';
import Statistics from './Statistics';
import './MyBook.css';

interface MyBookProps {
  book: LibraryBook;
  sessions: ReadingSession[];
  progress: number;
  isReading: boolean;
  onSessionDelete: (sessionId: string) => void;
}

const MyBook: React.FC<MyBookProps> = ({
  book,
  sessions,
  progress,
  isReading,
  onSessionDelete,
}) => {
  const [viewMode, setViewMode] = useState<'diary' | 'statistics'>('diary');

  return (
    <div className="my-book">
      <div className="book-header">
        <div className="book-cover-large">
          {book.imageUrl ? (
            <img src={book.imageUrl} alt={book.title} />
          ) : (
            <div className="book-placeholder">{book.title.charAt(0)}</div>
          )}
        </div>
        <div className="book-details">
          <h1 className="book-title">{book.title}</h1>
          <p className="book-author">by {book.author}</p>
          <div className="progress-info">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="progress-text">{progress.toFixed(0)}% completed</p>
          </div>
          {isReading && (
            <div className="reading-status">
              <span className="status-badge">Currently Reading</span>
            </div>
          )}
        </div>
      </div>

      <div className="view-switcher">
        <button
          className={`switch-button ${viewMode === 'diary' ? 'active' : ''}`}
          onClick={() => setViewMode('diary')}
        >
          Diary
        </button>
        <button
          className={`switch-button ${viewMode === 'statistics' ? 'active' : ''}`}
          onClick={() => setViewMode('statistics')}
        >
          Statistics
        </button>
      </div>

      <div className="content-area">
        {viewMode === 'diary' ? (
          <Diary
            book={book}
            sessions={sessions}
            onSessionDelete={onSessionDelete}
          />
        ) : (
          <Statistics book={book} sessions={sessions} progress={progress} />
        )}
      </div>
    </div>
  );
};

export default MyBook;

