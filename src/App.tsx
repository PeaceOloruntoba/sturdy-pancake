import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import HomePage from "./pages/Home";
import LoginPage from "./pages/auth/Login";
import { UserGuard } from "./guard/user.guard";
import { AdminGuard } from "./guard/admin.guard";
import SignupPage from "./pages/auth/Signup";
import SubscribePage from "./pages/Subscribe";
import MainLayout from "./layout/MainLayout";
import Chats from "./pages/user/Chats";
import Profile from "./pages/user/Profile";
import Dashboard from "./pages/user/Dashboard";
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/subscribe" element={<SubscribePage />} />
        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={
              <UserGuard>
                <Dashboard />
              </UserGuard>
            }
          />
          <Route
            path="/chats"
            element={
              <UserGuard>
                <Chats />
              </UserGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <UserGuard>
                <Profile />
              </UserGuard>
            }
          />
        </Route>
        <Route element={<AdminLayout />}>
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminDashboard />
              </AdminGuard>
            }
          />
        </Route>
      </Routes>
      <Toaster richColors />
    </BrowserRouter>
  );
}
