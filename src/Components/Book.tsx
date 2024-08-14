import React, { useState, useEffect, useRef } from "react";
import "./Book.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleLeft,
  faArrowCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import bookService, { IBook } from "../Services/bookService"; // Assuming you have the bookService in a file
import { useParams } from "react-router-dom";

const Book: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<number>(1);
  const [book, setBook] = useState<IBook>(null!);
  const [maxLocation, setMaxLocation] = useState<number>(0);
  const { id } = useParams();
  const bookRef = useRef<HTMLDivElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const paperRefs = useRef<HTMLDivElement[]>([]);
  const {getBook,cancelBook} = bookService.getBook(id!);

  useEffect(() => {
    getBook.then((fetchedBook) => {
      setBook(fetchedBook.data);
      setMaxLocation(fetchedBook.data.paragraphs.length + 1); // Adjust max location based on the number of paragraphs
    });
    return () => {
        cancelBook();
    }
  }, []);

//   const openBook = () => {
//     if (bookRef.current && prevBtnRef.current && nextBtnRef.current) {
//       bookRef.current.style.transform = "translateX(50%)";
//       prevBtnRef.current.style.transform = "translateX(-180px)";
//       nextBtnRef.current.style.transform = "translateX(180px)";
//     }
//   };

  const closeBook = (isAtBeginning: boolean) => {
    if (bookRef.current && prevBtnRef.current && nextBtnRef.current) {
      if (isAtBeginning) {
        bookRef.current.style.transform = "translateX(0%)";
      } else {
        bookRef.current.style.transform = "translateX(100%)";
      }
      prevBtnRef.current.style.transform = "translateX(0px)";
      nextBtnRef.current.style.transform = "translateX(0px)";
    }
  };

  const goNextPage = () => {
    if (currentLocation < maxLocation) {
      if (paperRefs.current[currentLocation - 1]) {
        paperRefs.current[currentLocation - 1].classList.add("flipped");
        paperRefs.current[currentLocation - 1].style.zIndex =
          String(currentLocation);
      }
      if (currentLocation === maxLocation - 1) closeBook(false);
      setCurrentLocation(currentLocation + 1);
    }
  };

  const goPrevPage = () => {
    if (currentLocation > 1) {
      if (paperRefs.current[currentLocation - 2]) {
        paperRefs.current[currentLocation - 2].classList.remove("flipped");
        paperRefs.current[currentLocation - 2].style.zIndex = String(
          maxLocation - currentLocation + 1
        );
      }
      if (currentLocation === 2) closeBook(true);
      setCurrentLocation(currentLocation - 1);
    }
  };

  if (!book) return null; // Show nothing until the book is loaded

  return (
    <div className="book-container">
      <button
        id="prev-btn"
        ref={prevBtnRef}
        onClick={goPrevPage}
        style={{ display: currentLocation === 1 ? "none" : "block" }}
      >
        <FontAwesomeIcon icon={faArrowCircleLeft} size="2x" />
      </button>

      <div id="book" className="book" ref={bookRef}>
        {book.paragraphs.map((paragraph, index) => (
          <div
            key={index}
            className="paper"
            ref={(el) => (paperRefs.current[index] = el as HTMLDivElement)}
          >
            <div className="front">
              <div className="front-content">
                <h1>{index === 0 ? book?.title : paragraph}</h1>
                {index === 0 && <img src={book?.coverImg} alt="Cover" />}
              </div>
            </div>
            <div className="back">
              <div className="back-content">
                <img
                  src={book.images[index]}
                  alt={`Image for paragraph ${index + 1}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        id="next-btn"
        ref={nextBtnRef}
        onClick={goNextPage}
        style={{ display: currentLocation === maxLocation ? "none" : "block" }}
      >
        <FontAwesomeIcon icon={faArrowCircleRight} size="2x" />
      </button>
    </div>
  );
};

export default Book;
