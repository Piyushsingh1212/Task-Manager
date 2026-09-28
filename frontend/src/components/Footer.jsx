// ─────────────────────────────────────────────────────────────
// src/components/Footer.jsx
// ─────────────────────────────────────────────────────────────
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Task Manager &mdash; WA-3 React Frontend</p>
      </div>
    </footer>
  );
}
