import type { LibraryBook, ReadingSession } from '../types';
import './Statistics.css';

interface StatisticsProps {
  book: LibraryBook;
  sessions: ReadingSession[];
  progress: number;
}

const Statistics: React.FC<StatisticsProps> = ({ book, sessions, progress }) => {
  const totalPagesRead = sessions.reduce((sum, session) => {
    return sum + (session.finishPage - session.startPage);
  }, 0);

  const totalReadingTime = sessions.reduce((sum, session) => {
    return sum + (session.readingTime || 0);
  }, 0);

  const averageSpeed =
    sessions.length > 0
      ? sessions.reduce((sum, session) => sum + (session.readingSpeed || 0), 0) /
        sessions.length
      : 0;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const progressData = sessions.map((session) => ({
    date: new Date(session.startReadingTime).toLocaleDateString(),
    pages: session.finishPage - session.startPage,
    percentage: ((session.finishPage / book.totalPages) * 100).toFixed(1),
  }));

  return (
    <div className="statistics">
      <h2 className="statistics-title">Reading Statistics</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{progress.toFixed(0)}%</div>
          <div className="stat-label">Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalPagesRead}</div>
          <div className="stat-label">Pages Read</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{formatTime(totalReadingTime)}</div>
          <div className="stat-label">Total Reading Time</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{sessions.length}</div>
          <div className="stat-label">Sessions</div>
        </div>
        {averageSpeed > 0 && (
          <div className="stat-card">
            <div className="stat-value">{averageSpeed.toFixed(1)}</div>
            <div className="stat-label">Avg. Speed (pages/min)</div>
          </div>
        )}
      </div>

      {progressData.length > 0 && (
        <div className="progress-chart">
          <h3 className="chart-title">Reading Progress Over Time</h3>
          <div className="chart-bars">
            {progressData.map((data, index) => (
              <div key={index} className="chart-bar-container">
                <div className="chart-bar-label">{data.date}</div>
                <div className="chart-bar-wrapper">
                  <div
                    className="chart-bar"
                    style={{
                      width: `${parseFloat(data.percentage)}%`,
                      height: '30px',
                    }}
                  >
                    <span className="chart-bar-value">{data.pages} pages</span>
                  </div>
                </div>
                <div className="chart-bar-percentage">{data.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;

