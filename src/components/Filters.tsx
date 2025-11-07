import { useState } from 'react';
import './Filters.css';

interface FiltersProps {
  onSubmit: (title: string, author: string) => void;
}

const Filters: React.FC<FiltersProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, author);
  };

  return (
    <div className="dashboard-section">
      <h3 className="filters-label">Filters:</h3>
      <form className="filters-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="book-title" className="filter-label">Book title:</label>
          <input
            id="book-title"
            type="text"
            placeholder="Enter text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="filter-input"
          />
        </div>
        <div>
          <label htmlFor="author" className="filter-label">The author:</label>
          <input
            id="author"
            type="text"
            placeholder="Enter text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="filter-input"
          />
        </div>
        <button type="submit" className="filter-button">
          To apply
        </button>
      </form>
    </div>
  );
};

export default Filters;

