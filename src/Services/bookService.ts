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
}

interface BooksAndFavorites {
  books: IBook[];
  favorites: IBook[];
}

class BookService {
  getBook(id: string) {
    const controller = new AbortController();
    const getBook= apiClient.get<IBook>(`/book/${id}`);
    return {getBook, cancelBook:()=>controller.abort()}
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
    const isLiked= apiClient.get<boolean>(`/book/isLiked/${id}`);
    return {isLiked, cancelIsLiked:()=>controller.abort()}
  }

  like(id: string) {
    return apiClient.put(`/book/like/${id}`);
  }

  unlike(id: string) {
    return apiClient.put(`/book/unlike/${id}`);
  }

  deleteBook(id: string) {
    return apiClient.delete(`/book/${id}`);
  }
}
export default new BookService();
