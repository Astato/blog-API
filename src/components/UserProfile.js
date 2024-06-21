import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { BASEURL } from "../App";
axios.defaults.withCredentials = true;
const UserProfile = ({ setClientLogged, setEditBlog }) => {
  const [userProfile, setUserProfile] = useState("");
  const [userAge, setUserAge] = useState("");
  const [aboutUser, setAboutUser] = useState("");
  const [userProfileImage, setUserProfileImage] = useState("");
  const [profileImageError, setProfileImageError] = useState("");
  const [changeAbout, setChangeAbout] = useState(false);
  const [successUpdateMessage, setSuccessMessage] = useState("");
  const [toDelete, setToDelete] = useState("");
  const confirmDeletionDialog = useRef(null);
  const navigate = useNavigate();

  async function getUserData() {
    try {
      const response = await axios.get(BASEURL + "/api/blogs/profile");
      if (response.status === 200) {
        const profile = response.data.user[0];
        profile.posts = response.data.posts;
        setUserProfile(profile);
        return response;
      }
    } catch (error) {
      console.log(error);
      setClientLogged(false);
      navigate("/sign-in");
      return error;
    }
  }

  const handleLogout = async () => {
    try {
      const response = await axios.get(BASEURL + "/api/blogs/logout");
      if (response.status === 200) {
        setUserProfile(response.data.user);
        setClientLogged(false);
        navigate("/sign-in");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveProfile = async (image, age, about) => {
    setChangeAbout(false);
    const query = `image=${DOMPurify.sanitize(image)}${
      !age ? "" : "&age=" + DOMPurify.sanitize(new Date(age).toISOString())
    }&about=${DOMPurify.sanitize(about)}`;
    const options = {
      method: "GET",
      url: BASEURL * "/api/blogs/profile?update=true&" + query,
    };
    try {
      const response = await axios(options);
      if (response.status === 200) {
        setSuccessMessage(
          "Profile Updated you'll see the changes next time you login"
        );
        setAboutUser("");
        setUserProfileImage("");
        setUserAge("");
        window.location.reload();
        return;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  const handlePostDelete = async () => {
    const findpost = userProfile.posts.findIndex(
      (posts) => posts._id === toDelete
    );
    try {
      const response = await axios.get(
        BASEURL + "/api/blogs/profile?delete=true&&id=" + toDelete
      );
      if (response.status === 200) {
        if (findpost >= 0) {
          setUserProfile((prev) => {
            const newArray = [...prev.posts];
            newArray.splice(findpost, 1);
            return {
              ...prev,
              posts: newArray,
            };
          });
        }
        setToDelete("DELETED");
      }
    } catch (error) {
      console.log(error);
      setClientLogged(false);
      navigate("/sign-in");
      return error;
    }
  };
  useEffect(() => {
    if (!userProfile) {
      getUserData().catch((error) => console.log(error));
    }
  }, [userProfile]);

  const { name, lastname, posts, email, comments, age, about, profileImage } =
    userProfile;

  if (userProfile) {
    return (
      <div id="user-profile">
        <dialog ref={confirmDeletionDialog} style={{ borderRadius: "20px" }}>
          <div style={{ background: "white" }}>
            <h3>
              {toDelete === "DELETED"
                ? "Post has been deleted"
                : "This action is irreversible, do you want to proceed?"}
            </h3>
            {toDelete && toDelete !== "DELETED" && (
              <button
                onClick={() => {
                  confirmDeletionDialog.current.close();
                  setToDelete("");
                }}
              >
                Cancel
              </button>
            )}
            {toDelete === "DELETED" ? (
              <button
                onClick={() => {
                  setToDelete("");
                  confirmDeletionDialog.current.close();
                }}
              >
                Close
              </button>
            ) : (
              <button style={{ background: "red" }} onClick={handlePostDelete}>
                Delete
              </button>
            )}
          </div>
        </dialog>
        <h1>About me </h1>
        <p>{successUpdateMessage || ""}</p>
        {profileImage && !profileImageError ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              className="profile-image"
              src={profileImage}
              alt="profile"
              onError={(e) => {
                e.target.src = "";
                setProfileImageError(true);
              }}
            />
            <button
              type="button"
              onClick={() => setProfileImageError("change")}
              style={{
                padding: ".5rem",
                fontSize: "15px",
                margin: "1rem auto",
              }}
            >
              Change
            </button>
          </div>
        ) : profileImageError === true ? (
          <label>
            <p>
              Profile Image <span>couldn't be loaded</span>
            </p>
            <input
              style={{ width: "auto" }}
              type="url"
              name="profileimage"
              onChange={(e) => setUserProfileImage(e.target.value)}
            />
          </label>
        ) : (
          <label>
            <p>Profile Image</p>
            <input
              style={{ width: "auto" }}
              type="url"
              name="profileimage"
              onChange={(e) => setUserProfileImage(e.target.value)}
            />
          </label>
        )}
        <h2>
          {name}, {lastname}
        </h2>
        <h3>{email}</h3>
        {age ? (
          <h3>
            Age:{" "}
            {Math.floor(
              (new Date().getTime() - new Date(age).getTime()) /
                (1000 * 60 * 60 * 24 * 365.25)
            )}
          </h3>
        ) : (
          <label>
            <p>Age:</p>
            <input
              type="date"
              value={userAge || new Date()}
              onChange={(e) => {
                setUserAge(e.target.value);
              }}
              name="userage"
              style={{ width: "10rem" }}
            />
          </label>
        )}
        {about && !changeAbout ? (
          <div
            style={{ display: "flex", flexDirection: "column", width: "80%" }}
          >
            <h3 style={{ textAlign: "center" }}>About me:</h3>
            <p style={{ fontSize: "18px", margin: "auto" }}>{about}</p>
            <button
              onClick={() => setChangeAbout(true)}
              style={{
                padding: ".5rem",
                fontSize: "15px",
                margin: "1rem auto",
              }}
            >
              Change
            </button>
          </div>
        ) : (
          <label>
            <p>About me:</p>
            <textarea
              cols={30}
              rows={5}
              onChange={(e) => setAboutUser(e.target.value)}
              name="aboutuser"
            ></textarea>
          </label>
        )}
        <h1>My Posts</h1>
        <div id="profile-posts-container">
          {posts.length === 0 ? (
            <p style={{ gridColumn: "span 3" }}>This looks to empty...</p>
          ) : (
            posts.map((post, index) => {
              return (
                <div className="profile-posts" key={index + 399}>
                  <h3>{post.title}</h3>
                  <p>
                    Posted on:{" "}
                    {new Date(post.date).toLocaleString().split(",")[0]}
                  </p>
                  <p>{post.description}</p>
                  <Link to={"/blogs/" + post._id}>
                    <button className="goto-blog-btn">Go to Blog</button>
                  </Link>
                  <Link onClick={(e) => setEditBlog(post)} to={"/create/edit"}>
                    <button className="edit-blog-btn">Edit</button>
                  </Link>
                  <button
                    className="edit-blog-btn"
                    style={{ backgroundColor: "red", margin: "auto" }}
                    onClick={() => {
                      confirmDeletionDialog.current.showModal();
                      setToDelete(post._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              );
            })
          )}
        </div>
        <h1>My Comments </h1>
        <div id="profile-comments-container">
          {comments.length === 0 ? (
            <p style={{ gridColumn: "span 3" }}>Nothing to see here...</p>
          ) : (
            comments.map((comment, index) => {
              return (
                <div className="profile-comments" key={index + 99}>
                  <h3>{comment.blogTitle}</h3>
                  <p>{comment.message}</p>
                  <Link to={"/blogs/" + comment.blogId}>
                    <button className="goto-blog-btn">Go to Blog</button>
                  </Link>
                </div>
              );
            })
          )}
        </div>
        {/* <h1>My Drafts</h1>
        {drafts.length === 0 ? <p>No saved drafts...</p> : null} */}
        <div>
          <button id="logout-btn" onClick={handleLogout}>
            Logout
          </button>
          {aboutUser || userAge || userProfileImage ? (
            <button
              onClick={() =>
                handleSaveProfile(userProfileImage, userAge, aboutUser)
              }
            >
              Save
            </button>
          ) : null}
        </div>
      </div>
    );
  }
};

export default UserProfile;
