# ReadJourney

ReadJourney is a modern web application for tracking your reading journey. Discover recommended books, manage your personal library, and track your reading progress with detailed statistics.

## 🚀 Features

- **User Authentication**: Secure registration and login system
- **Recommended Books**: Browse and discover new books with pagination and filtering
- **Personal Library**: Manage your book collection with status filtering (unread, in-progress, done)
- **Reading Tracking**: Track reading sessions with detailed statistics
- **Reading Diary**: View your reading history with session details
- **Reading Statistics**: Visual progress tracking and reading speed metrics

## 🛠️ Technologies Used

- **React 19** with **TypeScript** for type-safe component development
- **Vite** as the build tool and development server
- **React Router** for client-side routing
- **Redux Toolkit** for state management
- **React Hook Form** with **Yup** for form validation
- **Firebase** for authentication and Firestore database
- **Axios** for API requests
- **CSS3** with responsive design (mobile, tablet, desktop)

## 📋 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Header.tsx
│   ├── Dashboard.tsx
│   ├── BookCard.tsx
│   ├── BookModal.tsx
│   ├── Filters.tsx
│   ├── AddBookForm.tsx
│   ├── AddReadingForm.tsx
│   ├── Diary.tsx
│   ├── Statistics.tsx
│   └── ...
├── pages/           # Page components
│   ├── RegisterPage.tsx
│   ├── LoginPage.tsx
│   ├── RecommendedPage.tsx
│   ├── LibraryPage.tsx
│   └── ReadingPage.tsx
├── store/           # Redux store and slices
│   ├── store.ts
│   ├── slices/
│   └── hooks.ts
├── services/        # API service layer
│   └── api.ts
├── firebase/        # Firebase configuration and services
│   ├── config.ts
│   └── authService.ts
├── types/           # TypeScript type definitions
│   └── index.ts
└── App.tsx          # Main application component
```

## 🌐 API Integration

The application uses the ReadJourney Backend API:
- **Base URL**: `https://readjourney.b.goit.study/api`
- **API Documentation**: https://readjourney.b.goit.study/api-docs/

### API Endpoints Used

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/current` - Get current user
- `GET /books/recommended` - Get recommended books (with pagination and filtering)
- `GET /books/:id` - Get book details
- `POST /books/add` - Add book to library
- `GET /books/library` - Get user's library
- `DELETE /books/remove/:id` - Remove book from library
- `POST /reading/start` - Start reading session
- `POST /reading/finish` - Finish reading session
- `GET /reading/stats/:bookId` - Get reading statistics
- `DELETE /reading/session/:sessionId` - Delete reading session

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Mobile**: 320px and up (flexible from 375px)
- **Tablet**: 768px and up
- **Desktop**: 1440px and up

## 🎨 Design

- **Design Link**: [Figma Design](https://www.figma.com/file/z3m0rdBcEfLTJUBDkAKhWQ/BOOKS-READING?type=design&node-id=18743%3A4973&mode=design&t=Hi1KTaUJMogWXZZZ-1)
- **Technical Specification**: Included in project requirements

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ReadJourney
```

2. Install dependencies:
```bash
npm install
```

3. Firebase yapılandırması:
   - Firebase Console'dan yeni proje oluşturun
   - Authentication > Email/Password metodunu etkinleştirin
   - Firestore Database > Test mode'da oluşturun
   - Firebase Console'dan yapılandırma bilgilerini alın

4. Environment variables oluşturun:
   - Proje kök dizininde `.env` dosyası oluşturun
   - `env.example` dosyasını referans alarak Firebase bilgilerinizi ekleyin:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

5. Firestore Security Rules:
   - Firebase Console > Firestore Database > Rules
   - `FIREBASE_SETUP.md` dosyasındaki kuralları ekleyin

6. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Preview production build:
```bash
npm run preview
```

## 🔐 Authentication

The application uses **Firebase Authentication** for user management:
- User registration and login via Firebase Auth
- User data stored in Firestore Database
- Firebase ID tokens used for backend API authentication
- After successful login or registration, the token is stored in localStorage and automatically included in API requests

### Form Validation

- **Email**: Must match pattern `/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/`
- **Password**: Minimum 7 characters
- **Name** (Registration): Required string
- **Book Fields**: Title, Author (required strings), Total Pages (positive integer)

## 📖 Usage

1. **Register/Login**: Create an account or login to access the application
2. **Browse Recommended Books**: Use filters to search for books by title or author
3. **Add Books to Library**: Click on a book cover to view details and add to your library
4. **Manage Library**: View all your books, filter by status, and remove books
5. **Track Reading**: Start reading sessions, track progress, and view statistics
6. **View Progress**: Switch between Diary and Statistics views to see your reading journey

## 🚀 Deployment

The project can be deployed to:
- **Netlify**: Connect your repository for automatic deployments
- **Vercel**: Deploy with zero configuration
- **GitHub Pages**: Use GitHub Actions for CI/CD

## 📝 Development Notes

- All API requests are handled through the centralized `api.ts` service file
- Authentication state is managed using Redux Toolkit
- Forms use React Hook Form with Yup validation schemas
- Modal windows support ESC key and backdrop click to close
- Pagination is server-side for recommended books
- Reading statistics are calculated server-side

## 🔧 Future Enhancements

- Enhanced mobile burger menu functionality
- Book cover image upload
- Reading goals and challenges
- Social features (share progress, book reviews)
- Export reading statistics

## 📄 License

This project is developed as part of a technical assignment.
