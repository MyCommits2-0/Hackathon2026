import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="bg-gray-900 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">Course Admin Panel</h1>
      <div className="space-x-4">
        <Link to="/admin">Dashboard</Link>
        <Link to="/register">Register</Link>
        <Link to="/assign-discount">Assign Discount</Link>
      </div>
    </div>
  );
}