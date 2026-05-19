import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./util/http.js";
import HomeLayout from "./Pages/HomeLayout.jsx";
import Login from "./pages/Login/Login.jsx";
import LogoutModal from "./components/layout/Logout.jsx";
import About from "./pages/About/About.jsx";
import {fetchUserCart} from "./store/cartStore.js";
import AllProducts from "./pages/AllProducts/AllProducts.jsx"
import NotFound from "./components/UI/NotFound.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" />,
  },
  {
    path: "/home",
    element: <HomeLayout />,
  },
  { path: "/login", element: <Login /> },
  {
    path: "/logout",
    element: <LogoutModal />,
  },
  {
path: "/allProducts",
element: <AllProducts/>
  },
  {
    path: "about",
    element: <About />,
  },
  {
    path: "/products",
    lazy: async() => {
      const module=await import("./pages/Products/Products.jsx");
     return {Component: module.default};
    }
  },
  {
    path: "/products/:id",
    lazy: async()=>{
      const module = await import("./pages/ProductDetails/ProductDetails.jsx");
      return {Component : module.default}
    }
  },
  {
    path:"*",
    element: <NotFound/>
  }
]);

function App() {
  useEffect(() => {
    // If a token exists, load that user's cart on every page mount/refresh
    if (localStorage.getItem("token")) {
      fetchUserCart();
    }
  }, []);
 

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
