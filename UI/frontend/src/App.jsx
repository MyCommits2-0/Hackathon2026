import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


// import Login from "./pages/Admin/Login";
import Dashboard from "./pages/Admin/Dashboard";

// Student Pages
import CourseList from "./pages/Student/CourseList";
import Register from "./pages/Student/Register";
import StudentDashboard from "./pages/Student/StudentDashboard";
import RegisterBatch from "./pages/Student/RegisterBatch";
import MyRegistrations from "./pages/Student/MyRegistrations";

// Admin Pages
import StudentList from "./pages/Admin/StudentList";
import AddStudent from "./pages/Admin/AddStudent";
import CourseManager from "./pages/Admin/CourseManager";
import BatchManager from "./pages/Admin/BatchManager";
import DiscountManager from "./pages/Admin/DiscountManager";
import Reports from "./pages/Admin/Reports";

// Routes
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>

      {/* Navbar should NOT show on login */}
      {window.location.pathname !== "/login" && <Navbar />}

      <Routes>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* ================= STUDENT ROUTES ================= */}

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/courses"
          element={
            <ProtectedRoute role="student">
              <CourseList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/register-batch/:courseId"
          element={
            <ProtectedRoute role="student">
              <RegisterBatch />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/register/:batchId"
          element={
            <ProtectedRoute role="student">
              <Register />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/my-registrations"
          element={
            <ProtectedRoute role="student">
              <MyRegistrations />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ROUTES ================= */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/students"
          element={
            <ProtectedRoute role="admin">
              <StudentList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/add-student"
          element={
            <ProtectedRoute role="admin">
              <AddStudent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute role="admin">
              <CourseManager />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/batches"
          element={
            <ProtectedRoute role="admin">
              <BatchManager />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/discounts"
          element={
            <ProtectedRoute role="admin">
              <DiscountManager />
            </ProtectedRoute>
          }
        />

        {/* 🔥 ADD THIS (IMPORTANT) */}
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute role="admin">
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<h2 className="text-center mt-5">Page Not Found</h2>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;