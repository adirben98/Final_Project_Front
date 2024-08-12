import { useEffect, useState } from 'react'
import useAuth from '../Services/useAuth';
import heroService, { IHero } from '../Services/heroService';
import HeroRow from './HeroRow';




export default function AllHeroes() {
  

const [loading,setLoading] = useState<boolean>(true);
const {isLoading} = useAuth();
const {getHeroes, cancelHeroes} = heroService.getHeroes();
const [heroes, setHeroes] = useState<IHero[]>([]);

useEffect(() => {
  getHeroes.then((res) => {
    setHeroes(res.data);
    console.log(res.data);
  }).catch((err) => {
    console.log(err);
  })
  setLoading(isLoading);
  return () => {cancelHeroes()}
}, [isLoading])


    if (loading) {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <div
              className="spinner-border text-primary"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            ></div>
          </div>
        );
      }
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <h1>Heroes</h1>
    <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            listStyle: "none",
            padding: 0,
          }}
        >
          {heroes.map((hero) => (
           <li
           key={hero.name}
           style={{
             width: "calc(33.333% - 20px)",
             height: "300px",
             boxSizing: "border-box",
}}
            >
              <HeroRow
                name={hero.name}
                image={hero.image}
              />
            </li>
          ))}
        </ul>
  </div>
  )
}
