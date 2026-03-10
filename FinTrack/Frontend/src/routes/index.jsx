import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Protectedroutes from './protectedroutes'

// Page imports
import Landing from "../Pages/Landing/landing"
import LoginPage from "../Pages/Login/Login"
import RegisterPage from "../Pages/Register/Register"
import HomePage from "../Pages/Home/home"
import Profile from "../Pages/Profile/Profile"
import AdminDashboard from "../Pages/Admin/AdminDashboard"
import NotFound from "../Pages/NotFound/NotFound"

const routes = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    path: "/home",
    element: (
      <Protectedroutes>
        <HomePage />
      </Protectedroutes>
    ),
  },
  {
    path: "/profile",
    element: (
      <Protectedroutes>
        <Profile />
      </Protectedroutes>
    ),
  },
  {
    path: "/admin",
    element: (
      <Protectedroutes>
        <AdminDashboard />
      </Protectedroutes>
    ),
  },
  // Catch-all — show 404 page for unknown routes
  { path: "*", element: <NotFound /> },
]);

const AppRoutes = () => {
  return (
    <RouterProvider router={routes} />
  )
}

export default AppRoutes
