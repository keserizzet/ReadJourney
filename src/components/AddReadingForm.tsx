import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './AddReadingForm.css';

const readingSchema = yup.object({
  page: yup
    .number()
    .required('Page number is required')
    .positive('Must be a positive number')
    .integer('Must be an integer'),
});

interface AddReadingFormData {
  page: number;
}

interface AddReadingFormProps {
  isReading: boolean;
  onStart: (page: number) => void;
  onFinish: (page: number) => void;
}

const AddReadingForm: React.FC<AddReadingFormProps> = ({ isReading, onStart, onFinish }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddReadingFormData>({
    resolver: yupResolver(readingSchema),
  });

  const onSubmit = async (data: AddReadingFormData) => {
    if (isReading) {
      await onFinish(data.page);
    } else {
      await onStart(data.page);
    }
    reset();
  };

  return (
    <form className="add-reading-form" onSubmit={handleSubmit(onSubmit)}>
      <h3 className="form-title">Reading Progress</h3>
      <div className="form-group">
        <label htmlFor="page">
          {isReading ? 'Current Page' : 'Start Page'}
        </label>
        <input
          id="page"
          type="number"
          {...register('page', { valueAsNumber: true })}
          className={errors.page ? 'error' : ''}
          placeholder={isReading ? 'Enter current page' : 'Enter start page'}
        />
        {errors.page && <span className="error-message">{errors.page.message}</span>}
      </div>
      <button type="submit" className="submit-button" disabled={isSubmitting}>
        {isSubmitting ? 'Processing...' : isReading ? 'To stop' : 'To start'}
      </button>
    </form>
  );
};

export default AddReadingForm;

