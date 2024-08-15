import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import heroService, { IHero } from '../Services/heroService';
import useAuth from '../Services/useAuth';

const CustomArrow = ({ className, style, onClick, direction }: { className: string; style: React.CSSProperties; onClick: () => void; direction: 'left' | 'right' }) => (
  <button
    className={className}
    style={{
      ...style,
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '50%',
      cursor: 'pointer',
      width: '45px',
      height: '45px',
      border: 'none',
      [direction]: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    onClick={onClick}
  >
    {direction === 'left' ? '←' : '→'}
  </button>
);

export default function CreateStory() {
  const [selectedHero, setSelectedHero] = useState<number | null>(null);
  const [heroes, setHeroes] = useState<IHero[]>([]);
  const [step, setStep] = useState<number>(1); // Step state to manage page transition
  const { getHeroes, cancelHeroes } = heroService.getHeroes();
  const { isLoading } = useAuth();
  const [hero , setHero] = useState<string>();

  useEffect(() => {
    getHeroes
      .then((response) => setHeroes(response.data))
      .catch((error) => console.error('Error fetching heroes:', error));

    return () => cancelHeroes();
  }, [isLoading, getHeroes, cancelHeroes]);

  const handleHeroClick = (heroName : string ,index: number) => {
    setHero(heroName);
    setSelectedHero(index);
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const carouselContainerStyle: React.CSSProperties = {
    width: '40%',
    marginTop: '40px',
    margin: '0 auto',
  };

  const heroContainerStyle: React.CSSProperties = {
    width: 'auto', 
    maxWidth: '100%', 
    objectFit: 'cover',
    margin: '0 auto',
    padding: '10px',
  };

  const heroImageStyle = (isSelected: boolean): React.CSSProperties => ({
    width: 'auto',
    height: '300px',
    maxWidth: '100%',
    objectFit: 'cover',
    margin: '0 auto',
    padding: '10px',
    transition: 'transform 0.4s ease, box-shadow 0.4s ease',
    transform: isSelected ? 'scale(1.07)' : 'scale(0.8)',
    borderRadius: '15px',
  });

  const heroNameStyle: React.CSSProperties = {
    textAlign: 'center',
    marginTop: '10px',
    fontSize: '1.5em',
    color: '#333',
    fontFamily: "'Lobster', cursive",
  };

  const nextButtonStyle: React.CSSProperties = {
    display: selectedHero !== null ? 'block' : 'none',
    margin: '-50px auto',
    marginLeft: '700px',
    width: '60px',
    height: '60px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'lightblue',
    border: 'none',
    borderRadius: '50%', // Make the button circular
    cursor: 'pointer',
    textAlign: 'center',
    lineHeight: '60px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
    outline: 'none',
  };

  const handleNextButtonMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = '#add8e6';
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
  };

  const handleNextButtonMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = 'lightblue';
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
  };

  const settings = {
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    nextArrow: <CustomArrow direction="right" />,
    prevArrow: <CustomArrow direction="left" />,
    adaptiveHeight: true,
  };

  return (
    <section style={carouselContainerStyle}>
      {step === 1 && (
        <>
          <h2 style={{ textAlign: 'center', fontSize: '42px', marginBottom: '50px', color: '#333', letterSpacing: '1px', fontFamily: 'Arial, sans-serif' }}>
            Choose Your Heroes
          </h2>
          <div style={{ width: '100%', margin: '0 auto' }}>
            {heroes.length > 0 ? (
              <Slider {...settings}>
                {heroes.map((hero, index) => (
                  <div
                    key={hero.name}
                    style={heroContainerStyle}
                    onClick={() => handleHeroClick(hero.name,index)}
                  >
                    <img
                      src={hero.image}
                      alt={hero.name}
                      style={heroImageStyle(selectedHero === index)}
                    />
                    <p style={heroNameStyle}>{hero.name}</p>
                  </div>
                ))}
              </Slider>
            ) : (
              <p style={{ fontSize: '18px', color: '#777' }}>Loading heroes...</p>
            )}
          </div>
          <button
            style={nextButtonStyle}
            onClick={handleNextStep}
            onMouseEnter={handleNextButtonMouseEnter}
            onMouseLeave={handleNextButtonMouseLeave}
          >
            Next
          </button>
        </>
      )}

      {step === 2 && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h2 style={{ fontSize: '36px', color: '#333', fontFamily: 'Arial, sans-serif' }}>Your Story</h2>
          <textarea
            placeholder="Write your story here..."
            style={{
              width: '60%',
              height: '200px',
              padding: '15px',
              fontSize: '16px',
              borderRadius: '10px',
              border: '1px solid #ccc',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              marginBottom: '20px',
              resize: 'none',
            }}
          />
          <button
            style={{
              padding: '50px 50px',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#fff',
              backgroundColor: 'lightblue',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={handleNextButtonMouseEnter}
            onMouseLeave={handleNextButtonMouseLeave}
            onClick={() => alert('Story submitted!')} 
          >
            Create Story
          </button>
        </div>
      )}
    </section>
  );
}
