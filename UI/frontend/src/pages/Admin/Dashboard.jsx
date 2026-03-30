import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Dashboard = () => {
  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h2 className="mb-4">Admin Dashboard</h2>

        <div className="row g-4">

          {/* Courses */}
          <div className="col-md-4">
            <div className="card shadow p-3 text-center">
              <h5>Courses</h5>
              <p>Manage all courses</p>
              <Link to="/courses" className="btn btn-primary">
                Go
              </Link>
            </div>
          </div>

          {/* Batches */}
          <div className="col-md-4">
            <div className="card shadow p-3 text-center">
              <h5>Batches</h5>
              <p>Manage batches</p>
              <Link to="/batches" className="btn btn-primary">
                Go
              </Link>
            </div>
          </div>

          {/* Students */}
          <div className="col-md-4">
            <div className="card shadow p-3 text-center">
              <h5>Students</h5>
              <p>View students</p>
              <Link to="/students" className="btn btn-primary">
                Go
              </Link>
            </div>
          </div>

          {/* Discounts */}
          <div className="col-md-4">
            <div className="card shadow p-3 text-center">
              <h5>Discounts</h5>
              <p>Create & assign discounts</p>
              <Link to="/discounts" className="btn btn-success">
                Go
              </Link>
            </div>
          </div>

          {/* Registration */}
          <div className="col-md-4">
            <div className="card shadow p-3 text-center">
              <h5>Register Student</h5>
              <p>Register to batch</p>
              <Link to="/register" className="btn btn-warning">
                Go
              </Link>
            </div>
          </div>

          {/* Reports */}
          <div className="col-md-4">
            <div className="card shadow p-3 text-center">
              <h5>Reports</h5>
              <p>View all reports</p>
              <Link to="/reports" className="btn btn-dark">
                Go
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;