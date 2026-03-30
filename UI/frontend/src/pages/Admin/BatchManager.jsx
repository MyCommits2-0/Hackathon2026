import { useEffect, useState } from "react";
import { getBatches, addBatch } from "../../services/batchService";
import { getCourses } from "../../services/courseService";

export default function BatchManager() {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    course_id: "",
    name: "",
    fee: "",
    capacity: "",
    mode: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const batchRes = await getBatches();
      const courseRes = await getCourses();

      setBatches(batchRes.data);
      setCourses(courseRes.data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.course_id ||
      !form.name.trim() ||
      form.fee <= 0 ||
      form.capacity <= 0 ||
      !form.mode
    ) {
      setMessage("⚠ Please fill all fields correctly");
      return;
    }

    try {
      setLoading(true);
      await addBatch(form);

      setMessage("✅ Batch added successfully");

      setForm({
        course_id: "",
        name: "",
        fee: "",
        capacity: "",
        mode: ""
      });

      fetchData();
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Error adding batch");
    } finally {
      setLoading(false);
    }
  };

  // Get course name from ID (fallback)
  const getCourseName = (id) => {
    const course = courses.find((c) => c.id === id);
    return course ? course.name : id;
  };

  return (
    <div className="container mt-4">
      <div className="row">

        {/* Add Batch */}
        <div className="col-md-4">
          <div className="card shadow p-3">
            <h4>Add Batch</h4>

            {message && (
              <div className="alert alert-info">{message}</div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label>Course</label>
                <select
                  className="form-control"
                  name="course_id"
                  value={form.course_id}
                  onChange={handleChange}
                >
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label>Batch Name</label>
                <input
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label>Fee</label>
                <input
                  type="number"
                  className="form-control"
                  name="fee"
                  value={form.fee}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label>Capacity</label>
                <input
                  type="number"
                  className="form-control"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label>Mode</label>
                <select
                  className="form-control"
                  name="mode"
                  value={form.mode}
                  onChange={handleChange}
                >
                  <option value="">Select Mode</option>
                  <option value="ONLINE">Online</option>
                  <option value="OFFLINE">Offline</option>
                </select>
              </div>

              <button
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Batch"}
              </button>

            </form>
          </div>
        </div>

        {/* Batch List */}
        <div className="col-md-8">
          <div className="card shadow p-3">
            <h4>Batch List</h4>

            {loading ? (
              <p>Loading...</p>
            ) : batches.length === 0 ? (
              <p>No batches available</p>
            ) : (
              <table className="table table-bordered mt-3">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Course</th>
                    <th>Name</th>
                    <th>Fee</th>
                    <th>Capacity</th>
                    <th>Mode</th>
                  </tr>
                </thead>

                <tbody>
                  {batches.map((b) => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>{b.course_name || getCourseName(b.course_id)}</td>
                      <td>{b.name}</td>
                      <td>₹ {b.fee}</td>
                      <td>{b.capacity}</td>
                      <td>{b.mode}</td>
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