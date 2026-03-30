import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/dashboard">
        Admin Panel
      </Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">

          <li className="nav-item">
            <Link className="nav-link" to="/courses">Courses</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/batches">Batches</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/students">Students</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/discounts">Discounts</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/register">Register</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/reports">Reports</Link>
          </li>

          <li className="nav-item">
            <button
              className="btn btn-danger btn-sm ms-3"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          </li>

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;