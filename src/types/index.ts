// src/types.ts
export interface ReadingSession {
    _id: string;
    bookId: string;
  
    startPage: number;
    finishPage?: number;            // bazen gelmeyebilir
    startReadingTime?: string;      // p.startReading olabilir
    finishReadingTime?: string;     // p.finishReading olabilir
  
    readingTime?: number;
    readingSpeed?: number;          // p.speed olabilir
  
    // 🔧 HATANIN KÖKÜ: status tipini ekleyelim (opsiyonel)
    status?: 'active' | 'inactive';
  }
  
  export interface LibraryBook {
    _id: string;
    title: string;
    author: string;
    totalPages: number;
    status?: 'unread' | 'in-progress' | 'done';
    imageUrl?: string;
  
    // backend bazı sürümlerde progress döndürüyor
    progress?: Array<{
      startPage: number;
      finishPage?: number;
      startReading?: string;
      finishReading?: string;
      readingTime?: number;
      speed?: number;
      status?: 'active' | 'inactive';
    }>;
  }
  
  export interface RecommendedBook {
    _id: string;
    title: string;
    author: string;
    totalPages: number;
    imageUrl?: string;
  }
  
  export interface PaginationResponse<T> {
    books: T[];
    totalPages: number;
    currentPage: number;
    perPage: number;
  }
  
  export interface AuthResponse {
    token: string;
    user: {
      name: string;
      email: string;
      _id: string;
    };
  }
  