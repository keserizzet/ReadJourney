// src/components/AddBookForm.tsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { libraryAPI } from '../services/api';
import './AddBookForm.css';

// =========================================================
// ✅ Form Validation Schema
// =========================================================
const addBookSchema = yup.object({
  title: yup.string().required('Title is required'),
  author: yup.string().required('Author is required'),
  totalPages: yup
    .number()
    .typeError('Must be a number')
    .required('Total pages is required')
    .positive('Must be a positive number')
    .integer('Must be an integer'),
});

interface AddBookFormData {
  title: string;
  author: string;
  totalPages: number;
}

interface AddBookFormProps {
  onBookAdded: () => void;
}

const AddBookForm: React.FC<AddBookFormProps> = ({ onBookAdded }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddBookFormData>({
    resolver: yupResolver(addBookSchema),
    defaultValues: {
      totalPages: 0,
    },
  });

  // =========================================================
  // ✅ Form Submit Handler
  // =========================================================
  const onSubmit = async (data: AddBookFormData) => {
    try {
      await libraryAPI.addBook(data.title, data.author, data.totalPages);
      alert('Book added successfully!');
      reset();
      onBookAdded();
    } catch (error: any) {
      // Güvenli hata mesajı
      const msg =
        error.response?.data?.message || error.message || 'Failed to add book. Please try again.';
      alert(msg);
      console.error('Add book error:', error);
    }
  };

  return (
    <div className="dashboard-section">
      <form className="add-book-form" onSubmit={handleSubmit(onSubmit)}>
        <h3 className="form-title">Create your library:</h3>

        <div className="form-group">
          <label htmlFor="title">Book title:</label>
          <input
            id="title"
            type="text"
            placeholder="Enter text"
            {...register('title')}
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="author">The author:</label>
          <input
            id="author"
            type="text"
            placeholder="Enter text"
            {...register('author')}
            className={errors.author ? 'error' : ''}
          />
          {errors.author && <span className="error-message">{errors.author.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="totalPages">Number of pages:</label>
          <input
            id="totalPages"
            type="number"
            placeholder="0"
            {...register('totalPages', { valueAsNumber: true })}
            className={errors.totalPages ? 'error' : ''}
          />
          {errors.totalPages && <span className="error-message">{errors.totalPages.message}</span>}
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add book'}
        </button>
      </form>
    </div>
  );
};

export default AddBookForm;
