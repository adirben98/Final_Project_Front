import { apiClient } from "./useAuth";

export interface IBook {
  _id?: string;
  title: string;
  author: string;
  authorImg: string;
  description: string;
  paragraphs: string[];
  images: string[];
  coverImg: string;
  likes: number;
  likedBy: string[];
  createdAt: string;
  prompts: string[];
}

interface BooksAndFavorites {
  books: IBook[];
  favorites: IBook[];
}

class BookService {
  getAll() {
    const controller = new AbortController();
    const getBooks = apiClient.get<IBook[]>("/book", {
      signal: controller.signal,
    });
    return { getBooks, cancelBooks: () => controller.abort() };
  }
  getBook(id: string) {
    const controller = new AbortController();
    const getBook = apiClient.get<IBook>(`/book/${id}`);
    return { getBook, cancelBook: () => controller.abort() };
  }
  getUserBooksAndFavorites(username: string) {
    const controller = new AbortController();
    const userBooksAndFavorites = apiClient.get<BooksAndFavorites>(
      `/book/getUserBooksAndFavorites/${username}`,
      {
        signal: controller.signal,
      }
    );
    return {
      userBooksAndFavorites,
      cancelUserBooksAndFavorites: () => controller.abort(),
    };
  }

  isLiked(id: string) {
    const controller = new AbortController();
    const isLiked = apiClient.get<boolean>(`/book/isLiked/${id}`);
    return { isLiked, cancelIsLiked: () => controller.abort() };
  }

  like(id: string) {
    return apiClient.put(`/book/like/${id}`);
  }

  unlike(id: string) {
    return apiClient.put(`/book/unlike/${id}`);
  }

  search(query: string) {
    const controller = new AbortController();
    const results = apiClient.get<IBook[]>(`/book/search/${query}`, {
      signal: controller.signal,
    });
    return { results, cancelSearch: () => controller.abort() };
  }
  searchByHero(name: string) {
    const controller = new AbortController();
    const results = apiClient.get<IBook>("/book/searchByHero/" + name, {
      signal: controller.signal,
    });
    return { results, cancelSearch: () => controller.abort() };
  }

  deleteBook(id: string) {
    return apiClient.delete(`/book/${id}`);
  }
}
export default new BookService();
