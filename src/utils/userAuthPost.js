import axios from "axios";

async function userAuthPost(email, password) {
  const options = {
    method: "Post",
    url: "http://localhost:5000/api/blogs/authenticate",
    data: { email: email, password: password },
    Headers: { "Content-Type": "json/application" },
  };

  try {
    const response = await axios(options);
    return response;
  } catch (error) {
    return error.response;
  }
}

export default userAuthPost;
