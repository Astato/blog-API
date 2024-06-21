import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BlogCategories from "./BlogCategories";
import axios from "axios";
import { BASEURL } from "../App";
const Discover = ({ setOpenBlog }) => {
  const [blogsData, setBlogsData] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getBlogs = async () => {
    try {
      const response = await axios.get(BASEURL + "/api/blogs?loadItems=1");
      setBlogsData(response.data.allBlogs);
      setIsLoading(false);
      return response.status;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  useEffect(() => {
    getBlogs().catch((error) => console.log(error));
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          backgroundColor: "black",
          minHeight: "100vh",
          minWidth: "100vw",
        }}
      >
        Loading...
      </div>
    );
  }

  const blogs = blogsData.map((blog, index) => {
    const { _id, title, description, date, creatorName } = {
      ...blog,
    };
    return (
      <Link
        className="link-to-blog"
        key={index}
        to={"/blogs/" + _id}
        onClick={() => setOpenBlog(blog)}
      >
        <div className="blog-container">
          <h2>{title}</h2>
          <p>{description}</p>
          <p>
            Posted on: {new Date(date).toLocaleString().split(",")[0]} by{" "}
            <span
              style={{
                fontWeight: "bolder",
                textDecoration: "underline",
                fontSize: "18px",
              }}
            >
              {creatorName}
            </span>
          </p>
        </div>
      </Link>
    );
  });

  return (
    <div id="explore-container">
      <h1>Discover</h1>
      <div className="categories-container">
        <BlogCategories></BlogCategories>
      </div>
      <h1 style={{ color: "#008fe2 " }}>Latest Posts</h1>
      <section id="latest-blogs-container">{blogs}</section>
    </div>
  );
};

export default Discover;
