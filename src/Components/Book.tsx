import React, { useState, useEffect, useRef } from "react";
import "./Book.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft, faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";
import bookService, { IBook } from "../Services/bookService";
import { useParams } from "react-router-dom";
import axios from "axios";

const Book: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<number>(0);
  const [book, setBook] = useState<IBook | null>(null);
  const { id } = useParams();
  const paperRefs = useRef<HTMLDivElement[]>([]);
  const { getBook, cancelBook } = bookService.getBook(id!);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const fetchedBook = await getBook;
        setBook(fetchedBook.data);
      } catch (err) {
        console.error("Error fetching book:", err);
      }
    };

    fetchBookData();

    return () => {
      cancelBook();
    };
  }, [getBook, cancelBook]);

  const generateImage = async (prompt: string): Promise<string> => {
    try {
      const response = await axios.post("/generatePhoto", { hero: localStorage.getItem("hero"), prompt });
      return response.data;
    } catch (err) {
      console.error("Error generating image:", err);
      return "";
    }
  };

  const goNextPage = async () => {
    if (currentLocation < book!.paragraphs.length + 1) {
      if (!book!.images[currentLocation]) {
        const newImage = await generateImage(book!.prompts[currentLocation]);
        book!.images[currentLocation] = newImage;
        setBook({ ...book! }); // Update the book state with the new image
      }
      if (paperRefs.current[currentLocation]) {
        paperRefs.current[currentLocation].classList.add("flipped");
        paperRefs.current[currentLocation].style.zIndex = String(currentLocation + 1);
      }
      setCurrentLocation(currentLocation + 1);
    }
  };

  const goPrevPage = () => {
    if (currentLocation > 0) {
      if (paperRefs.current[currentLocation - 1]) {
        paperRefs.current[currentLocation - 1].classList.remove("flipped");
        paperRefs.current[currentLocation - 1].style.zIndex = String(book!.paragraphs.length - currentLocation + 1);
      }
      setCurrentLocation(currentLocation - 1);
    }
  };

  const refreshImage = async () => {
    if (currentLocation > 0) {
      const updatedImage = await generateImage(book!.prompts[currentLocation - 1]);
      book!.images[currentLocation - 1] = updatedImage;
      setBook({ ...book! }); // Update state
    }
  };

  const saveBook = async () => {
    try {
      await bookService.save({
        title: book!.title,
        author: "Idan the author",
        authorImg: "https://cdn-icons-png.flaticon.com/512/1995/1995571.png",
        images: book!.images,
        paragraphs: book!.paragraphs,
        description: book!.description,
        coverImg: book!.coverImg,
      });
    } catch (err) {
      console.error("Error saving book:", err);
    }
  };

  if (!book) return null;

  return (
    <div className="book-container">
      {currentLocation > 0 && (
        <button
          id="prev-btn"
          onClick={goPrevPage}
          className="nav-btn prev-btn"
        >
          <FontAwesomeIcon icon={faArrowCircleLeft} size="3x" />
        </button>
      )}

      <div id="book" className="book">
        {/* Cover page */}
        <div
          className="paper first-page"
          ref={(el) => (paperRefs.current[0] = el as HTMLDivElement)}
        >
          <div className="front">
            <img src={book.coverImg} alt="Cover" className="cover-image" />
          </div>
          <div className="back">
            <div className="page-content">
              <div className="text-content">
                <p>{book.paragraphs[0]}</p>
              </div>
              <div className="image-content">
                <img src={book.images[0]} alt="Illustration" />
              </div>
            </div>
          </div>
        </div>

        {/* Inner pages */}
        {book.paragraphs.slice(1).map((paragraph, index) => (
          <div
            key={index + 1}
            className="paper"
            ref={(el) => (paperRefs.current[index + 1] = el as HTMLDivElement)}
          >
            <div className="front">
              <div className="page-content">
                <div className="text-content">
                  <p>{paragraph}</p>
                </div>
                <div className="image-content">
                  <img src={book.images[index + 1]} alt={`Image for paragraph ${index + 1}`} />
                </div>
              </div>
            </div>
            <div className="back"></div>
          </div>
        ))}

        {/* Finish page */}
        <div
          className="paper last-page"
          ref={(el) => (paperRefs.current[book.paragraphs.length] = el as HTMLDivElement)}
        >
          <div className="front">
            <div className="front-content">
              <h2>Finish</h2>
            </div>
          </div>
        </div>
      </div>

      {currentLocation < book.paragraphs.length + 1 && (
        <button
          id="next-btn"
          onClick={goNextPage}
          className="nav-btn next-btn"
        >
          <FontAwesomeIcon icon={faArrowCircleRight} size="3x" />
        </button>
      )}
    </div>
  );
};

export default Book;
