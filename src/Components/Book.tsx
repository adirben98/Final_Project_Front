import React, { useState, useEffect, useRef } from "react";
import "../Css/Book.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleLeft,
  faArrowCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import bookService from "../Services/bookService";
import { useParams } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import userService from "../Services/userService";

const Book: React.FC = () => {
  const [pages, setPages] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState<number>(1);
  const [maxLocation, setMaxLocation] = useState<number>(1);
  const { id } = useParams();
  const bookRef = useRef<HTMLDivElement | null>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const paperRefs = useRef<HTMLDivElement[]>([]);
  const buttonRefs = useRef<HTMLButtonElement[]>([]);
  const [clickedBtns, setClickedBtns] = useState<boolean[]>([]);
  let counter = 0;
  const { isLoading } = useAuth();
  const [prompts, setPrompts] = useState<string[]>(["cover"]);
  const [hero, setHero] = useState<string>("");
  const [isAuthor, setIsAuthor] = useState<boolean>(false);

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
          paperRefs.current[0].style.zIndex = `${maxLocation}`;
          break;
        case maxLocation:
          openBook();
          paperRefs.current[maxLocation - 2].classList.remove("flipped");
          paperRefs.current[maxLocation - 2].style.zIndex = `${1}`;
          break;
        default:
          paperRefs.current[currentLocation - 2].classList.remove("flipped");
          paperRefs.current[currentLocation - 2].style.zIndex = `${
            maxLocation - currentLocation + 2
          }`;
          break;
      }
      setCurrentLocation((prev) => prev - 1);
    }
  };

  const refreshPhoto = async () => {
    const index = currentLocation - 1;
    let prompt =""
    if(index-1>=0)
      prompt=prompts[index-1];

    setClickedBtns((prev) =>
      prev.map((clicked, i) => (i === index ? true : clicked))
    );
    bookService
      .generateImage(prompt, index - 1, id!, hero)
      .generateImage.then((res) => {
        const newImg = res.data;
        const newPages = [...pages];
        newPages[index * 2] = newImg;
        setPages(newPages);
        setClickedBtns((prev) =>
          prev.map((clicked, i) => (i === index ? false : clicked))
        );
      })
      .catch((error) => {
        console.log(error);
        setClickedBtns((prev) =>
          prev.map((clicked, i) => (i === index ? false : clicked))
        );
      });
  };
  const { getBook, cancelBook } = bookService.getBook(id!);
  useEffect(() => {
    let isMounted = true; // To prevent state updates if the component is unmounted

    const fetchData = async () => {
      try {
        const fetchedBook = await getBook;
        if (
          userService.getConnectedUser()!.username === fetchedBook.data.author
        ) {
          setIsAuthor(true);
        }

        if (!isMounted) return;

        const arr = [fetchedBook.data.coverImg];

        for (let i = 0; i < fetchedBook.data.paragraphs.length; i++) {
          arr.push(fetchedBook.data.paragraphs[i]);
          arr.push(fetchedBook.data.images[i]);
        }
        arr.push("The End");

        if (isMounted) {
          setPages(arr);
          setPrompts([...fetchedBook.data.prompts]);
          setHero(fetchedBook.data.hero);
          setMaxLocation(fetchedBook.data.paragraphs.length + 2);
          setClickedBtns(
            new Array(fetchedBook.data.paragraphs.length + 1).fill(true)
          );
          setClickedBtns((prev) =>
            prev.map((clicked, i) => (i === 0 ? false : clicked))
          );
        }
        if (fetchedBook.data.images.length === 0) {
          for (let i = 0; i < fetchedBook.data.paragraphs.length; i++) {
            try {
              const res = await bookService.generateImage(
                fetchedBook.data.prompts[i],
                i,
                id!,
                fetchedBook.data.hero
              ).generateImage;
              if (isMounted) {
                setPages((prevPages) => {
                  const newPages = [...prevPages];
                  newPages[(i + 1) * 2] = res.data;
                  return newPages;
                });
                setClickedBtns((prev) =>
                  prev.map((clicked, index) =>
                    index === i + 1 ? false : clicked
                  )
                );
              }
            } catch (error) {
              console.error(error);
              if (isMounted) {
                // Handle error gracefully, e.g., by showing a message or default image
              }
            }
          }
        }
        else{
          setClickedBtns(
            new Array(fetchedBook.data.paragraphs.length + 1).fill(false)
          );
        }
      } catch (error) {
        console.error("Failed to fetch book:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Set isMounted to false to prevent state updates

      cancelBook();
      for (let i = 0; i < prompts.length; i++) {
        bookService
          .generateImage(prompts[i], i, id!, hero)
          .cancelGenerateImage();
      }
    };
  }, [id, isLoading]);

  return (
    <div className="container">
      <button onClick={prevPage} ref={prevBtnRef}>
        <FontAwesomeIcon className="btn" icon={faArrowCircleLeft} />
      </button>

      <div className="book" id="book" ref={bookRef}>
        {pages.map((page, index) => {
          if (index % 2 === 0) {
            const frontPage = page;
            const backPage = pages[index + 1];

            const paperDiv = (
              <div
                id={"p" + counter}
                style={{ zIndex: maxLocation - counter }}
                className="paper"
                ref={(el) => paperRefs.current.push(el!)}
              >
                {!clickedBtns[currentLocation - 1] ? (
                  <div className="front">
                    <div id={"f" + counter} className="front-content">
                      <img
                        src={frontPage}
                        alt={`front-${counter}`}
                        style={{ width: "300px", height: "300px" }}
                      />
                    </div>
                    {isAuthor && (
                      <button
                        className="btn btn-primary"
                        ref={(el) => buttonRefs.current.push(el!)}
                        onClick={refreshPhoto}
                      >
                        Refresh Photo
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="front">
                    <div id={"f" + counter} className="front-content">
                      <div className="spinner"></div>{" "}
                      {/* Spinner displayed here */}
                    </div>
                  </div>
                )}

                <div className="back">
                  <div id={"b" + counter} className="back-content">
                    {index + 1 === pages.length - 1 ? (
                      <h1>{backPage}</h1>
                    ) : (
                      <p className="scrollable-paragraph">{backPage}</p>
                    )}
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
