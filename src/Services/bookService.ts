import { apiClient } from "./useAuth";

export interface IBook {
    _id?: string;
    title: string;
    author: string;
    authorImg:string;
    description: string;
    paragraphs: string[];
    images: string[];
    coverImg: string;
    likes: number;
    likedBy: string[];
    createdAt: string;
}

interface BooksAndFavorites{
    books: IBook[];
    favorites: IBook[];
}

class BookService {
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
}
export default new BookService();
