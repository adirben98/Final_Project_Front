import React, { useState, useRef } from 'react';
import './Book.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';

const Book: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<number>(1);
  const numOfPapers = 3;
  const maxLocation = numOfPapers + 1;

  // Create refs for elements
  const bookRef = useRef<HTMLDivElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const paper1Ref = useRef<HTMLDivElement>(null);
  const paper2Ref = useRef<HTMLDivElement>(null);
  const paper3Ref = useRef<HTMLDivElement>(null);

  const openBook = () => {
    if (bookRef.current && prevBtnRef.current && nextBtnRef.current) {
      bookRef.current.style.transform = 'translateX(50%)';
      prevBtnRef.current.style.transform = 'translateX(-180px)';
      nextBtnRef.current.style.transform = 'translateX(180px)';
    }
  };

  const closeBook = (isAtBeginning: boolean) => {
    if (bookRef.current && prevBtnRef.current && nextBtnRef.current) {
      if (isAtBeginning) {
        bookRef.current.style.transform = 'translateX(0%)';
      } else {
        bookRef.current.style.transform = 'translateX(100%)';
      }
      prevBtnRef.current.style.transform = 'translateX(0px)';
      nextBtnRef.current.style.transform = 'translateX(0px)';
    }
  };

  const goNextPage = () => {
    if (currentLocation < maxLocation) {
      switch (currentLocation) {
        case 1:
          openBook();
          if (paper1Ref.current) {
            paper1Ref.current.classList.add('flipped');
            paper1Ref.current.style.zIndex = '1';
          }
          break;
        case 2:
          if (paper2Ref.current) {
            paper2Ref.current.classList.add('flipped');
            paper2Ref.current.style.zIndex = '2';
          }
          break;
        case 3:
          if (paper3Ref.current) {
            paper3Ref.current.classList.add('flipped');
            paper3Ref.current.style.zIndex = '3';
          }
          closeBook(false);
          break;
        default:
          throw new Error('unknown state');
      }
      setCurrentLocation(currentLocation + 1);
    }
  };

  const goPrevPage = () => {
    if (currentLocation > 1) {
      switch (currentLocation) {
        case 2:
          closeBook(true);
          if (paper1Ref.current) {
            paper1Ref.current.classList.remove('flipped');
            paper1Ref.current.style.zIndex = '3';
          }
          break;
        case 3:
          if (paper2Ref.current) {
            paper2Ref.current.classList.remove('flipped');
            paper2Ref.current.style.zIndex = '2';
          }
          break;
        case 4:
          openBook();
          if (paper3Ref.current) {
            paper3Ref.current.classList.remove('flipped');
            paper3Ref.current.style.zIndex = '1';
          }
          break;
        default:
          throw new Error('unknown state');
      }
      setCurrentLocation(currentLocation - 1);
    }
  };

  return (
    <div className="book-container" >
      <button id="prev-btn" ref={prevBtnRef} onClick={goPrevPage}>
        <FontAwesomeIcon icon={faArrowCircleLeft} size="2x" />
      </button>

      <div id="book" className="book" ref={bookRef}>
        <div id="p1" className="paper" ref={paper1Ref}>
          <div className="front">
            <div id="f1" className="front-content">
              <h1>Front 1</h1>
            </div>
          </div>
          <div className="back">
            <div id="b1" className="back-content">
              <h1>Back 1</h1>
            </div>
          </div>
        </div>
        <div id="p2" className="paper" ref={paper2Ref}>
          <div className="front">
            <div id="f2" className="front-content">
              <h1>Front 2</h1>
            </div>
          </div>
          <div className="back">
            <div id="b2" className="back-content">
              <h1>Back 2</h1>
            </div>
          </div>
        </div>
        <div id="p3" className="paper" ref={paper3Ref}>
          <div className="front">
            <div id="f3" className="front-content">
              <h1>Front 3</h1>
            </div>
          </div>
          <div className="back">
            <div id="b3" className="back-content">
              <h1>Back 3</h1>
            </div>
          </div>
        </div>
      </div>

      <button id="next-btn" ref={nextBtnRef} onClick={goNextPage}>
        <FontAwesomeIcon icon={faArrowCircleRight} size="2x" />
      </button>
    </div>
  );
};

export default Book;
