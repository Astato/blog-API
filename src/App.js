import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Create from "./components/Create";
import Discover from "./components/Discover.js";
import SignIn from "./components/SignIn";
import ErrorPage from "./components/ErrorPage";
import BlogPage from "./components/BlogPage";
import UserProfile from "./components/UserProfile";
import axios from "axios";
import BlogCategories from "./components/BlogCategories";

function App() {
  const [openBlog, setOpenBlog] = useState(null);
  const [clientLogged, setClientLogged] = useState(false);
  const [editBlog, setEditBlog] = useState(false);

  const isClientLogged = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/blogs/logged"
      );
      if (response.status === 200) {
        setClientLogged(response.data.logged);
        return response;
      }
    } catch (error) {
      setClientLogged(false);
      console.log(error);
      return error;
    }
  };

  useEffect(() => {
    isClientLogged().catch((error) => console.log(error));
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <header>
          <Navbar clientLogged={clientLogged} />
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/create"
            element={
              <Create clientLogged={clientLogged} setOpenBlog={setOpenBlog} />
            }
          />
          <Route
            path="/create/edit"
            element={<Create clientLogged={clientLogged} editBlog={editBlog} />}
          />
          <Route
            path="/discover"
            element={<Discover setOpenBlog={setOpenBlog} />}
          />
          <Route
            path="/sign-in"
            element={<SignIn setClientLogged={setClientLogged} />}
          />
          <Route path="*" element={<ErrorPage />} />
          <Route
            path="/blogs/:id"
            element={
              <BlogPage openBlog={openBlog} clientLogged={clientLogged} />
            }
          />
          <Route
            path="/blogs/category/:category"
            element={<BlogCategories setOpenBlog={setOpenBlog} />}
          ></Route>
          <Route
            path="/profile/:user"
            element={
              <UserProfile
                setClientLogged={setClientLogged}
                setEditBlog={setEditBlog}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
