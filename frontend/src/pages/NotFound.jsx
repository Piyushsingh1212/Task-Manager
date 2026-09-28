// ─────────────────────────────────────────────────────────────
// src/pages/NotFound.jsx — 404 page
// ─────────────────────────────────────────────────────────────
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page not-found">
      <h1 className="not-found-code">404</h1>
      <h2>Page Not Found</h2>
      <p>The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.</p>
      <Link to="/" className="btn btn-primary">
        Go Home
      </Link>
    </div>
  );
}
