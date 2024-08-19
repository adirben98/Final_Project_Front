import React, { useState, useEffect, useRef } from "react";
import "./Book.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleLeft,
  faArrowCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import bookService from "../Services/bookService";
import { useParams } from "react-router-dom";

const Book: React.FC = () => {
  const [pages, setPages] = useState<string[]>([
    "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg",
    "2",
    "https://castfromclay.co.uk/wp-content/uploads/image-asset-1-1024x683.jpeg",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
  ]);
  const [currentLocation, setCurrentLocation] = useState<number>(1);
  const [maxLocation, setMaxLocation] = useState<number>(11);
  const { id } = useParams();
  const bookRef = useRef<HTMLDivElement | null>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const paperRefs = useRef<HTMLDivElement[]>([]);
  let counter = 0;
  const { getBook, cancelBook } = bookService.getBook(id!);
  

  const openBook = () => {
    bookRef.current!.style.transform = "translateX(50%)";
    prevBtnRef.current!.style.transform = "translateX(-250%)";
    nextBtnRef.current!.style.transform = "translateX(250%)";
  };

  const closeBook = (isAtBeginning: boolean) => {
    if (isAtBeginning) {
      bookRef.current!.style.transform = "translateX(0%)";
    } else {
      bookRef.current!.style.transform = "translateX(100%)";
    }
    prevBtnRef.current!.style.transform = "translateX(0%)";
    nextBtnRef.current!.style.transform = "translateX(0%)";
  };

  const nextPage = () => {
    if (currentLocation < maxLocation) {
      switch (currentLocation) {
        case 1:
          openBook();
          paperRefs.current[0].classList.add("flipped");
          paperRefs.current[0].style.zIndex = "1";
          break;
        case maxLocation - 1:
          paperRefs.current[maxLocation - 2].classList.add("flipped");
          paperRefs.current[maxLocation - 2].style.zIndex = `${
            maxLocation - 1
          }`;
          closeBook(false);
          break;
        default:
          paperRefs.current[currentLocation - 1].classList.add("flipped");
          paperRefs.current[
            currentLocation - 1
          ].style.zIndex = `${currentLocation}`;
          break;
      }
      setCurrentLocation((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentLocation > 1) {
      switch (currentLocation) {
        case 2:
          closeBook(true);
          paperRefs.current[0].classList.remove("flipped");
          paperRefs.current[0].style.zIndex = `${maxLocation - 1}`;
          break;
        case maxLocation:
          openBook();
          paperRefs.current[maxLocation - 2].classList.remove("flipped");
          paperRefs.current[maxLocation - 2].style.zIndex = `${1}`;
          break;
        default:
          paperRefs.current[currentLocation - 2].classList.remove("flipped");
          paperRefs.current[currentLocation - 2].style.zIndex = `${
            maxLocation - currentLocation + 1
          }`;
          break;
      }
      setCurrentLocation((prev) => prev - 1);
    }
  };

  useEffect(() => {
    getBook.then((fetchedBook) => {
      const arr=[fetchedBook.data.coverImg];

      for (let i = 0; i < fetchedBook.data.paragraphs.length; i++) {
        arr.push(fetchedBook.data.paragraphs[i]);
        arr.push(fetchedBook.data.images[i]);
      }
      arr.push("The End")
      setPages(arr)

      setMaxLocation(fetchedBook.data.paragraphs.length+2); // Adjust max location based on the number of paragraphs
    });
    return () => {
        cancelBook();
    }
  }, [id]);
  return (
    <div className="container">
      <button onClick={prevPage} ref={prevBtnRef}>
        <FontAwesomeIcon className="btn" icon={faArrowCircleLeft} />
      </button>

      <div className="book" id="book" ref={bookRef}>
        {pages.map((page, index) => {
          // Only process even indices since we're handling pairs (front and back)
          if (index % 2 === 0) {
            const frontPage = page;
            const backPage = pages[index + 1]; // Get the next page for the back

            const paperDiv = (
              <div
                id={"p" + counter}
                style={{ zIndex: maxLocation - counter }}
                className="paper"
                ref={(el) => paperRefs.current.push(el!)}
              >
                <div className="front">
                  <div id={"f" + counter} className="front-content">
                    <img
                      src={frontPage}
                      alt={`front-${counter}`}
                      style={{ width: "200px", height: "150px" }}
                    />
                  </div>
                </div>
                <div className="back">
                  <div id={"b" + counter} className="back-content">
                    <h1>{backPage}</h1>
                  </div>
                </div>
              </div>
            );

            counter++;
            return paperDiv;
          } else {
            return null;
          }
        })}
      </div>
      <button onClick={nextPage} ref={nextBtnRef}>
        <FontAwesomeIcon className="btn" icon={faArrowCircleRight} />
      </button>
    </div>
  );
};
export default Book;
