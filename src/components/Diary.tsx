import type { LibraryBook, ReadingSession } from '../types';
import './Diary.css';

interface DiaryProps {
  book: LibraryBook;
  sessions: ReadingSession[];
  onSessionDelete: (sessionId: string) => void;
}

const Diary: React.FC<DiaryProps> = ({ book, sessions, onSessionDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculatePercentage = (finishPage: number) => {
    return ((finishPage / book.totalPages) * 100).toFixed(1);
  };

  const formatTime = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (sessions.length === 0) {
    return (
      <div className="empty-diary">
        <p>No reading sessions yet. Start reading to track your progress!</p>
      </div>
    );
  }

  return (
    <div className="diary">
      <h2 className="diary-title">Reading Diary</h2>
      <div className="diary-list">
        {sessions.map((session) => (
          <div key={session._id} className="diary-entry">
            <div className="entry-header">
              <h3 className="entry-date">{formatDate(session.startReadingTime)}</h3>
              <button
                className="delete-entry-button"
                onClick={() => onSessionDelete(session._id)}
                aria-label="Delete session"
              >
                ×
              </button>
            </div>
            <div className="entry-details">
              <div className="detail-item">
                <span className="detail-label">Pages read:</span>
                <span className="detail-value">
                  {session.finishPage - session.startPage}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Reading time:</span>
                <span className="detail-value">{formatTime(session.readingTime)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Progress:</span>
                <span className="detail-value">
                  {calculatePercentage(session.finishPage)}%
                </span>
              </div>
              {session.readingSpeed && (
                <div className="detail-item">
                  <span className="detail-label">Speed:</span>
                  <span className="detail-value">
                    {session.readingSpeed.toFixed(1)} pages/min
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Diary;

