import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <div className="card shadow p-4 text-center">
        <h2>Student Dashboard</h2>

        <div className="mt-4">

          <button
            className="btn btn-primary m-2"
            onClick={() => navigate("/student/courses")}
          >
            View Courses
          </button>

          <button
            className="btn btn-success m-2"
            onClick={() => navigate("/student/my-registrations")}
          >
            My Registrations
          </button>

        </div>
      </div>
    </div>
  );
}