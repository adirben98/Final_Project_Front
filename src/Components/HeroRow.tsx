import { Link } from "react-router-dom";
import { IHero } from "../Services/heroService";
export default function HeroRow({ name, image }: IHero) {
  return (
    <div
      className="card mb-4"
      style={{ height: "30vh", display: "flex", flexDirection: "column" }}
    >
      <Link to={`/search?q=${name}&f=hero`}>
        <img
          src={image}
          className="card-img-top"
          alt={name}
          style={{ height: "15vh", objectFit: "cover" }}
        />
      </Link>
      <div
        className="card-body"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <h5
          className="card-title"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <Link
            to={`/search?q=${name}&f=hero`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {name}
          </Link>
        </h5>
      </div>
    </div>
  );
}
