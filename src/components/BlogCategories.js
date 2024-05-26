import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link, useParams } from "react-router-dom";
const BlogCategories = ({ setOpenBlog }) => {
  const [blogsByCategory, setBlogsByCategory] = useState("");
  const [loadItems, setLoadItems] = useState(1);
  const [dataLength, setDataLength] = useState(0);
  const navigate = useNavigate();
  const { category } = useParams();

  const getBlogsByCategory = async () => {
    const options = {
      method: "GET",
      url:
        "http://localhost:5000/api/blogs?category=" +
        category +
        "&loadItems=" +
        loadItems,
    };

    try {
      let response;
      if (category === "all") {
        response = await axios({
          method: "GET",
          url: "http://localhost:5000/api/blogs?loadItems=" + loadItems,
        });
      } else {
        response = await axios(options);
      }
      if (response.status == 200 && category !== "all") {
        setDataLength(response.data.items[0].count);
        return setBlogsByCategory((prev) => [...prev, ...response.data.blogs]);
      } else {
        setDataLength(response.data.items[0].count);
        return setBlogsByCategory((prev) => [
          ...prev,
          ...response.data.allBlogs,
        ]);
      }
    } catch (error) {
      console.log(error);
      return setBlogsByCategory("");
    }
  };

  useEffect(() => {
    if (category) {
      getBlogsByCategory().catch((error) => console.log(error));
    }
  }, [category, loadItems]);

  const handleClick = (arg) => {
    if (category === arg) {
      return;
    }
    setLoadItems(1);
    setBlogsByCategory("");
    return navigate("/blogs/category/" + arg);
  };
  const handleSeeAll = () => {
    return navigate("/blogs/category/" + "all");
  };

  // if (blogsByCategory) {
  //   const blogs = blogsByCategory.map((blog, index) => {
  //     const { _id, title, description, date, creatorName } = { ...blog };
  //     return (
  //       <Link
  //         className="link-to-blog"
  //         key={index + 400}
  //         to={"/blogs/" + _id}
  //         onClick={() => setOpenBlog(blog)}
  //       >
  //         <div className="blog-container">
  //           <h2>{title}</h2>
  //           <p>{description}</p>
  //         </div>
  //       </Link>
  //     );
  //   });

  //   return <div>{blogs}</div>;
  // }

  return (
    <section id={!category ? "blog-categories" : "blogs-categories-page"}>
      <div className="categories-links-container">
        <div onClick={() => handleClick("technology")}>
          <h2>Technology</h2>
        </div>
        <div onClick={() => handleClick("lifestyle")}>
          <h2>Lifestyle</h2>
        </div>
        <div onClick={() => handleClick("creativity")}>
          <h2>Creativity</h2>
        </div>
        <div onClick={() => handleClick("food")}>
          <h2>Food</h2>
        </div>
        <div onClick={() => handleClick("travel")}>
          <h2>Travel</h2>
        </div>
        <div onClick={() => handleClick("enviorment")}>
          <h2>Enviorment</h2>
        </div>
        <div onClick={() => handleClick("music")}>
          <h2>Music</h2>
        </div>
        <div onClick={() => handleClick("others")}>
          <h2>Others</h2>
        </div>
      </div>
      {category ? (
        <section style={{ gridColumn: "span 4" }} id="category-blogs-container">
          <h1>{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
          {blogsByCategory ? (
            blogsByCategory.map((blog, index) => {
              const { _id, title, description, date, creatorName } = {
                ...blog,
              };
              return (
                <Link
                  className="link-to-blog"
                  key={index + 400}
                  to={"/blogs/" + _id}
                  onClick={() => setOpenBlog(blog)}
                >
                  <div className="blog-container">
                    <h2>{title}</h2>
                    <p>{description}</p>
                    <p>
                      Posted on: {new Date(date).toLocaleString().split(",")[0]}{" "}
                      by{" "}
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
            })
          ) : (
            <span>
              <h2>
                There are no post with this category, create one or see them
                all!
              </h2>
              <div>
                <Link to="/create">
                  <button>CREATE!</button>
                </Link>
                <button onClick={handleSeeAll}>See all</button>
              </div>
            </span>
          )}
          {dataLength > loadItems * 12 ? (
            <div id="page-navigation-buttons">
              <button onClick={() => setLoadItems((prev) => prev + 1)}>
                Load More
              </button>
            </div>
          ) : blogsByCategory ? (
            <h2 style={{ textAlign: "center", gridColumn: "span 3" }}>
              No more content to load
            </h2>
          ) : null}
        </section>
      ) : null}
    </section>
  );
};

export default BlogCategories;
