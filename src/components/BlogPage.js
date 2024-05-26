import { useEffect, useState } from "react";
import { stringify } from "himalaya";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import xIcon from "../social-icons/x-icon.svg";
import instagramIcon from "../social-icons/instagram-icon.svg";
import facebookIcon from "../social-icons/facebook-icon.svg";

import axios from "axios";
const BlogPage = ({ openBlog, clientLogged }) => {
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageSaved, setMessageSaved] = useState(false);
  const [user, setUser] = useState("");
  const [creatorData, setCreatorData] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  async function getBlogById(id) {
    const options = {
      method: "POST",
      url: "http://localhost:5000/api/blogs/blog/" + id,
      withCredentials: false,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
    };
    try {
      const response = await axios(options);
      if (response.status === 200) {
        setBlog(response.data.blog);
        setIsLoading(false);
        return response;
      } else {
        return navigate("/blognotFound");
      }
    } catch (error) {
      console.log(error);
      return navigate("/blognotFound");
    }
  }

  async function getCreatorData(id) {
    const options = {
      method: "POST",
      url: "http://localhost:5000/api/blogs/creatorinfo",
      data: "creatorID=" + id,
      withCredentials: false,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
    };
    try {
      const response = await axios(options);
      if (response.status === 200) {
        setCreatorData(response.data);
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  useEffect(() => {
    if (!openBlog && !blog) {
      getBlogById(id).catch((error) => console.log(error));
    } else {
      setBlog([openBlog]);
      setIsLoading(false);
    }
    if (!clientLogged) {
      setUser("");
    }
    if (clientLogged) {
      setUser(clientLogged.name + " " + clientLogged.lastname);
    }
  }, []);

  const handleSubmitMessage = async (message, blogId, blogTitle) => {
    const date = new Date().toISOString();
    const commenterName = user;
    const commenterID = clientLogged._id;
    const options = {
      method: "POST",
      url: "http://localhost:5000/api/blogs/saveblogmessage",
      data: { message, blogId, date, commenterName, commenterID, blogTitle },
      headers: { "Content-Type": "application/json" },
    };
    try {
      const response = await axios(options);
      if (response.status === 200) {
        setMessageSaved(true);
        return window.location.reload();
      } else {
        return setMessageSaved(404);
      }
    } catch (error) {
      console.log(error);
      return setMessageSaved(404);
    }
  };

  if (isLoading) {
    return <div style={{ backgroundColor: "black" }}></div>;
  }

  const { title, blog_content, date, messages, creatorID } = blog[0];
  if (creatorID && !creatorData) {
    getCreatorData(creatorID);
  }

  const { name, lastname, about, profileImage } = creatorData;
  const parsedBlogContent = stringify(blog_content);
  return (
    <div id="blog-page">
      {/* <div id="similar-content-sidebar">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div> */}
      <article>
        <div dangerouslySetInnerHTML={{ __html: parsedBlogContent }}></div>
      </article>
      <div className="author">
        <p style={{ color: "white" }}>
          Created: {new Date(date).toLocaleString()}
        </p>
        <h2>About the Disciple</h2>
        <span className="blog-page-creator-profile">
          <img src={profileImage}></img>
          <p style={{ fontSize: "18px", fontWeight: "bolder" }}>
            {name}, {lastname}
          </p>
        </span>
        <p>
          {about ||
            "Now, the client will receive the token in the response cookie and can use it for subsequent requests to stay authenticated. Make sure to handle this token securely on the client-side and include it in the headers of future requests."}{" "}
        </p>
        <div className="social-media-links">
          <p style={{ fontSize: "20px", fontWeight: "bolder" }}>
            Share this post!
          </p>
          <div style={{ width: "fit-content" }}>
            <a
              target="_blank"
              href={
                "https://twitter.com/intent/tweet?text=Check%20this%20awesome%20blog%20from%20DISC!&url=http://localhost:3000" +
                location.pathname
              }
            >
              <img style={{ backgroundColor: "black" }} src={xIcon} />
            </a>
            {/* <a>
              <img src={instagramIcon}></img>
            </a> */}
            <a
              href={
                "https://www.facebook.com/sharer/sharer.php?u=http://localhost:3000" +
                location.pathname
              }
              target="_blank"
              // rel="noopener noreferrer"
            >
              <img src={facebookIcon}></img>
            </a>
          </div>
        </div>
      </div>
      <div id="blog-comments">
        <h2>Comments</h2>
        <div>
          {messages.length >= 1
            ? messages.map((message, index) => {
                return (
                  <div className="blog-message" key={index}>
                    <p style={{ fontSize: "12px" }}>
                      {new Date(message.date).toLocaleString()}
                    </p>
                    <p style={{ fontWeight: "bolder" }}>
                      {/* {new Date(message.date).toLocaleString()} */}
                      {message.commenter} said:
                    </p>
                    <p>{message.message}</p>
                  </div>
                );
              })
            : null}
        </div>
        <h2>Leave a comment:</h2>
        <textarea
          rows={8}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <div style={{ display: "flex", alignItems: "center" }}>
          {clientLogged ? (
            <button onClick={(e) => handleSubmitMessage(message, id, title)}>
              Send
            </button>
          ) : (
            <Link
              to="/sign-in"
              style={{ fontSize: "23px", color: "#008fe2", marginTop: "2rem" }}
            >
              Login to leave a message
            </Link>
          )}
          {messageSaved === 404 ? (
            <p style={{ color: "orange", fontSize: "23px" }}>
              An error has ocurred.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
