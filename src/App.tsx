import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import HomePage from "./pages/Home";
import LoginPage from "./pages/auth/Login";
import { UserGuard } from "./guard/user.guard";
import { AdminGuard } from "./guard/admin.guard";
import SignupPage from "./pages/auth/Signup";
import SubscribePage from "./pages/Subscribe";
import MainLayout from "./layout/MainLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/subscribe" element={<SubscribePage />} />
        {/* Example protected routes */}
        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={
              <UserGuard>
                <div>Dashboard (User Protected)</div>
              </UserGuard>
            }
          />
        </Route>
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <div>Admin Panel (Admin Protected)</div>
            </AdminGuard>
          }
        />
      </Routes>
      <Toaster richColors />
    </BrowserRouter>
  );
}
