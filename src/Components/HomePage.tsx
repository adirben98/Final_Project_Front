import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import homePageImg from "../assets/homePageImg.png";
import heroService, { IHero } from "../Services/heroService";
import useAuth from "../Services/useAuth";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ChevronLeft, ChevronRight } from "react-feather";
import { FaBook } from 'react-icons/fa';

const HomePage: React.FC = () => {
  const topBooks: string[] = ["Book 1", "Book 2", "Book 3", "Book 4", "Book 5"];
  const latestBooks: string[] = ["Latest Book 1", "Latest Book 2", "Latest Book 3"];

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column" as const,
      height: "100vh",
    },
    subHeader: {
      fontSize: "1.8em",
      color: "#4682B4",
      marginBottom: "10px",
      textShadow: "1px 1px #87CEEB",
      textAlign: "left" as const,
    },
    image: {
      width: "100%",
      height: "auto",
      objectFit: "cover" as const,
      display: "block",
    },
    content: {
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      paddingLeft: "20px",
      paddingRight: "20px",
      borderRadius: "8px",
      width: "100%",
      maxWidth: "1200px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      flex: 1,
    },
    carouselContainer: {
      width: '100%',
      marginTop: '40px',
    },
    heroImage: {
      width: 'auto',
      height: '300px',
      maxWidth: '100%',
      objectFit: 'cover' as const,
      margin: '0 auto',
      padding: '10px',
    },
    heroName: {
      textAlign: 'center' as const,
      marginTop: '10px',
      fontSize: '1.5em',
      color: '#333',
      fontFamily: "'Lobster', cursive",
    },
    arrow: {
      position: 'absolute' as const,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '50%',
      cursor: 'pointer',
      padding: '5px',
    },
    openingPhrase: {
      fontSize: "2.5em",
      color: "#333",
      fontFamily: "'Dancing Script', cursive",
      textAlign: "left" as const,
      margin: "20px 0",
    },
    description: {
      fontSize: "1.2em",
      color: "#555",
      textAlign: "left" as const,
      margin: "20px 0",
      lineHeight: "1.6",
      fontFamily: "'Roboto', sans-serif",
    },
    catchphrase: {
      fontSize: "1.4em",
      color: "#333",
      textAlign: "center" as const,
      margin: "20px 0",
      fontFamily: "'Dancing Script', cursive",
    },
  };

  const PreviousArrow = ({ onClick }: { onClick?: React.MouseEventHandler }) => (
    <div style={{ ...styles.arrow, left: '10px' }} onClick={onClick}>
      <ChevronLeft size={40} color="white" />
    </div>
  );

  const NextArrow = ({ onClick }: { onClick?: React.MouseEventHandler }) => (
    <div style={{ ...styles.arrow, right: '10px' }} onClick={onClick}>
      <ChevronRight size={40} color="white" />
    </div>
  );

  const { isLoading } = useAuth();
  const [heroes, setHeroes] = useState<IHero[]>([]);
  const { getHeroes, cancelHeroes } = heroService.getHeroes();

  useEffect(() => {
    getHeroes.then((response) => {
      setHeroes(response.data);
    });

    return () => {
      cancelHeroes();
    };
  }, [isLoading]);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PreviousArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <div style={styles.container}>
      <img src={homePageImg} alt="Homepage Banner" style={styles.image} />

      <div style={styles.content}>
        <section style={styles.openingPhrase}>
          Your Story, Your Way
        </section>

        <section style={styles.description}>
          At Bookify, we believe that every story deserves to be told—and no one can tell it like you can. We’re excited to welcome you into a world where your creativity takes center stage. Here, you’re not just creating a book; you’re crafting a one-of-a-kind adventure tailored to your imagination. Choose your hero, weave your tale, and watch as your personalized story unfolds. Share it with others, gather inspiration, and connect with a community of storytellers who value the uniqueness of your voice. With Bookify, your story isn’t just a book—it’s an experience, as original and special as you are.
        </section>

        <section style={styles.catchphrase}>
          Let Your Imagination Soar{" "}
          <FaBook style={{ marginRight: "10px" }} />
        </section>

        <section style={{ marginBottom: "40px", width: "100%", marginTop: "40px" }}>
          <h2 style={styles.subHeader}>Top 5 Books of the Week</h2>
          <ul>
            {topBooks.map((book, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                {book}
              </li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: "40px", width: "100%" }}>
          <h2 style={styles.subHeader}>Latest Books Created</h2>
          <ul>
            {latestBooks.map((book, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                {book}
              </li>
            ))}
          </ul>
        </section>

        <section style={styles.carouselContainer}>
          <h2 style={{ textAlign: "left" }}>Meet Your Heroes</h2>
          <div style={{ width: '50%', padding: "50px", margin: "0 auto" }}>
            <Slider {...settings}>
              {heroes.map((hero, index) => (
                <div key={index}>
                  <img src={hero.image} alt={hero.name} style={styles.heroImage} />
                  <p style={styles.heroName}>{hero.name}</p>
                </div>
              ))}
            </Slider>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
