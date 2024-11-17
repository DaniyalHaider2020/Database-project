import "./App.css"
import Login from "./Pages/Login/Login"
import Register from "./Pages/Register/Register"
import Home from "./Pages/Home/Home"
import Profile from "./Pages/Profile/Profile"
import LeftSide from "./Components/LeftSide/LeftSide"
import RightSide from "./Components/RightSide/RightSide"
import Navbar from "./Components/Navbar/Navbar"
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import { useContext } from "react"
import { AuthContext } from "./Context/authContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

let App = () =>
{
  const {currentUser} = useContext(AuthContext);

  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div>
          <Navbar />
          <div style={{ display: "flex" }}>
            <LeftSide />
            <div style={{ flex: 10 }}>
              <Outlet />
            </div>
            {/* <RightSide /> */}
          </div>
        </div>
      </QueryClientProvider>
    );
  };
  const ProtectedRoute = ({children}) =>
  {
    if(!currentUser)
      return <Navigate to="/Login"/>
    return children;
  }
  const router = createBrowserRouter([
    {
    path: "/",
      element: 
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
      ],
    },
    {
      path: "/Login",
      element: <Login />,
    },
    {
      path: "/Register",
      element: <Register />,
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
