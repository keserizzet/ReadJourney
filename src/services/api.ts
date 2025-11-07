import axios, { AxiosError } from "axios";
import type {
  AuthResponse,
  LibraryBook,
  RecommendedBook,
  PaginationResponse,
  ReadingSession,
} from "../types";

const API_BASE_URL = "https://readjourney.b.goit.study/api";
const api = axios.create({ baseURL: API_BASE_URL });

/* ------------------------------ REQUEST ------------------------------ */
api.interceptors.request.use((config: any) => {
  const authEndpoints = ["/users/signup", "/users/signin"];
  const isAuthEndpoint = authEndpoints.some((endpoint) =>
    config.url?.includes(endpoint)
  );

  if (!isAuthEndpoint) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

/* ------------------------------ RESPONSE ----------------------------- */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const url = error.config?.url || "";
    const status = error.response?.status;

    const isReadingStats404 =
      status === 404 && url.includes("/books/reading/stats");

    if (!isReadingStats404) {
      console.error("API Error:", {
        url,
        status,
        message: (error.response?.data as any) || error.message,
      });
    }

    // 🔐 Unauthorized - reset session
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

/* ------------------------------ HELPERS ------------------------------ */
const mapProgressToSessions = (book: LibraryBook): ReadingSession[] => {
  const progressArray = (book as any).progress || [];
  return progressArray.map((p: any, i: number) => ({
    _id: `${book._id}-${i}`,
    bookId: book._id,
    startPage: p.startPage,
    finishPage: p.finishPage ?? 0,
    startReadingTime: p.startReading || p.startReadingTime || "",
    finishReadingTime: p.finishReading || p.finishReadingTime || "",
    readingTime: p.readingTime,
    readingSpeed: p.speed ?? p.readingSpeed,
    status: p.status ?? (p.finishPage ? "inactive" : "active"),
  }));
};

/* -------------------------------- AUTH -------------------------------- */
export const authAPI = {
  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const { data } = await api.post("/users/signup", { name, email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post("/users/signin", { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/users/signout");
    } catch (err) {
      console.warn("⚠️ Signout request failed:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  getCurrentUser: async () => {
    const { data } = await api.get("/users/current");
    return data;
  },
};

/* -------------------------------- BOOKS ------------------------------- */
export const booksAPI = {
  getRecommended: async (
    page = 1,
    limit = 10,
    title?: string,
    author?: string
  ): Promise<PaginationResponse<RecommendedBook>> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (title) params.append("title", title);
    if (author) params.append("author", author);

    const { data } = await api.get(`/books/recommend?${params.toString()}`);

    const normalizedBooks = (data.results || []).map((b: any) => {
      const image =
        b.imageUrl ||
        b.image_url ||
        b.book_image ||
        b.cover ||
        b.image ||
        `https://placehold.co/200x300?text=${encodeURIComponent(b.title || "Book")}`;

      if (b._id) {
        const images = JSON.parse(localStorage.getItem("bookImages") || "{}");
        images[b._id] = image;
        localStorage.setItem("bookImages", JSON.stringify(images));
      }

      return { ...b, imageUrl: image };
    });

    return {
      books: normalizedBooks,
      totalPages: data.totalPages || 1,
      currentPage: data.page || page,
      perPage: data.perPage || limit,
    };
  },
};

/* ------------------------------- LIBRARY ------------------------------ */
export const libraryAPI = {
  getLibrary: async (
    status?: "unread" | "in-progress" | "done"
  ): Promise<LibraryBook[]> => {
    const params = status ? { status } : undefined;
    const { data } = await api.get("/books/own", { params });

    const images = JSON.parse(localStorage.getItem("bookImages") || "{}");

    return data.map((b: any) => ({
      ...b,
      imageUrl:
        b.imageUrl ||
        b.image_url ||
        images[b._id] ||
        `https://placehold.co/200x300?text=${encodeURIComponent(b.title || "Book")}`,
    }));
  },

  addBook: async (
    title: string,
    author: string,
    totalPages: number,
    imageUrl?: string
  ): Promise<LibraryBook> => {
    const { data } = await api.post("/books/add", { title, author, totalPages });

    if (imageUrl) {
      const images = JSON.parse(localStorage.getItem("bookImages") || "{}");
      images[data._id] = imageUrl;
      localStorage.setItem("bookImages", JSON.stringify(images));
    }

    return {
      ...data,
      imageUrl:
        imageUrl ||
        `https://placehold.co/200x300?text=${encodeURIComponent(title || "Book")}`,
    };
  },

  removeFromLibrary: async (bookId: string): Promise<void> => {
    await api.delete(`/books/remove/${bookId}`);
  },
};

/* ------------------------------- READING ------------------------------ */
export const readingAPI = {
  startReading: async (id: string, page: number): Promise<LibraryBook> => {
    console.log("📘 startReading", id, page);
    const { data } = await api.post("/books/reading/start", { id, page });
    return data;
  },

  finishReading: async (id: string, page: number): Promise<LibraryBook> => {
    console.log("📗 finishReading", id, page);
    const { data } = await api.post("/books/reading/finish", { id, page });
    return data;
  },

  getReadingStats: async (
    bookId: string
  ): Promise<{ sessions: ReadingSession[]; progress: number }> => {
    console.log("📙 getReadingStats triggered:", bookId);
    try {
      const libraryBooks = await libraryAPI.getLibrary();
      const book = libraryBooks.find((b) => b._id === bookId);

      if (!book) {
        console.warn("⚠️ Book not found in libraryAPI:", bookId);
        return { sessions: [], progress: 0 };
      }

      const sessions = mapProgressToSessions(book);
      const totalRead = sessions.reduce(
        (sum, s) => sum + Math.max(0, (s.finishPage || 0) - s.startPage),
        0
      );
      const progress =
        book.totalPages > 0 ? (totalRead / book.totalPages) * 100 : 0;

      console.log("✅ getReadingStats success:", sessions.length, "sessions");
      return { sessions, progress };
    } catch (error) {
      console.error("❌ getReadingStats failed:", error);
      return { sessions: [], progress: 0 };
    }
  },

  deleteSession: async (sessionId: string): Promise<void> => {
    console.log("🗑️ deleteSession", sessionId);
    await api.delete(`/books/reading/session/${sessionId}`);
  },
};

export default api;
