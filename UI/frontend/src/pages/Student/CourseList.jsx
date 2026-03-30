import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import API from "../../api/axios";
API.get("/...")

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    const res = await axios.get("http://localhost:5000/courses");
    setCourses(res.data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h3>Select Course</h3>

        <div className="row">
          {courses.map((c) => (
            <div key={c.id} className="col-md-4">
              <div className="card p-3 mb-3 shadow-sm">
                <h5>{c.name}</h5>
                <p>{c.description}</p>

                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate(`/student/register-batch/${c.id}`)
                  }
                >
                  View Batches
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}