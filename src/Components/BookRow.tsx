import { Link } from 'react-router-dom';

export interface bookRow {
  image: string;
  title: string;
  description?: string;
  url:string
}

export default function BookRow({ image, title, description, url }: bookRow) {
  return (
    <div className="card mb-4" style={{ height: '30vh', display: 'flex', flexDirection: 'column' }}>
      <Link to={url}>
        <img src={image} className="card-img-top" alt={title} style={{ height: '15vh', objectFit: 'cover' }} />
      </Link>
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '1rem' }}>
        <h5 className="card-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <Link to={url} style={{ textDecoration: 'none', color: 'inherit' }}>{title}</Link>
        </h5>
        <p className="card-text" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '1px' }}>{description}</p>
      </div>
    </div>
  );
}
