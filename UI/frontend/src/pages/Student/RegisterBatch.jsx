import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

const res = await API.get(`/batches/course/${courseId}`);

export default function RegisterBatch() {
  const { courseId } = useParams();
  const [batches, setBatches] = useState([]);
  const navigate = useNavigate();

  const fetchBatches = async () => {
    const res = await axios.get(
      `http://localhost:5000/batches/course/${courseId}`
    );
    setBatches(res.data);
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h3>Select Batch</h3>

        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Fee</th>
              <th>Capacity</th>
              <th>Mode</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {batches.map((b) => (
              <tr key={b.id}>
                <td>{b.name}</td>
                <td>₹{b.fee}</td>
                <td>{b.capacity}</td>
                <td>{b.mode}</td>
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() =>
                      navigate(`/student/register/${b.id}`)
                    }
                  >
                    Register
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}