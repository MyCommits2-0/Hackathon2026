import { useEffect, useState } from "react";
import { getCourses, addCourse } from "../../services/courseService";

export default function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await getCourses();
      setCourses(res.data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.description.trim()) {
      setMessage("⚠ All fields are required");
      return;
    }

    try {
      setLoading(true);
      await addCourse(form);

      setMessage("✅ Course added successfully");
      setForm({ name: "", description: "" });

      fetchCourses();
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Error adding course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">

        {/* Add Course */}
        <div className="col-md-4">
          <div className="card shadow p-3">
            <h4>Add Course</h4>

            {message && (
              <div className="alert alert-info">{message}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Name</label>
                <input
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label>Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              <button
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Course"}
              </button>
            </form>
          </div>
        </div>

        {/* Course List */}
        <div className="col-md-8">
          <div className="card shadow p-3">
            <h4>Course List</h4>

            {loading ? (
              <p>Loading...</p>
            ) : courses.length === 0 ? (
              <p>No courses available</p>
            ) : (
              <table className="table table-bordered mt-3">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                  </tr>
                </thead>

                <tbody>
                  {courses.map((c) => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.name}</td>
                      <td>{c.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}