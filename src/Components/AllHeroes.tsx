import { useEffect, useState } from 'react';
import useAuth from '../Services/useAuth';
import heroService, { IHero } from '../Services/heroService';

export default function AllHeroes() {
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading } = useAuth();
  const { getHeroes, cancelHeroes } = heroService.getHeroes();
  const [heroes, setHeroes] = useState<IHero[]>([]);

  useEffect(() => {
    getHeroes
      .then((res) => {
        setHeroes(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(isLoading);
    return () => {
      cancelHeroes();
    };
  }, [isLoading]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f0f8ff', // Light background for loading screen
        }}
      >
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: '3rem', height: '3rem' }}
        ></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', fontFamily: "'Comic Sans MS', Arial, sans-serif", backgroundColor: '#f0f8ff' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50', fontSize: '42px', marginBottom: '20px' }}>
        Our Heroes
      </h1>
      <p style={{ textAlign: 'center', color: '#555', fontSize: '20px', marginBottom: '40px', maxWidth: '600px', margin: '0 auto' }}>
        Discover our amazing collection of heroes. Click on your favorite hero to learn more about them!
      </p>
      <ul
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px', // Keep the gap between images
          listStyle: 'none',
          padding: 0,
          justifyContent: 'center',
          marginTop: '30px', // Add margin to push images down from the text
        }}
      >
        {heroes.map((hero) => (
          <li
            key={hero.name}
            style={{
              width: 'calc(25% - 20px)', // Adjusted to 25% width to fit 4 images in a row
              height: '250px', // Height of the images remains the same
              boxSizing: 'border-box',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.1)';
            }}
          >
            <img
              onClick={() => { window.location.href = `/search?q=${hero.name}&f=hero` }}
              src={hero.image}
              alt={hero.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain', // Ensure the whole image is shown within the container
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '10px',
                backgroundColor: 'rgba(44, 62, 80, 0.85)',
                color: '#fff',
                textAlign: 'center',
                fontSize: '18px',
                fontFamily: "'Arial', sans-serif",
              }}
            >
              {hero.name}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
