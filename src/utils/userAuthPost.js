import axios from "axios";
import { BASEURL } from "../App";
async function userAuthPost(email, password) {
  const options = {
    method: "Post",
    url: BASEURL + "/api/blogs/authenticate",
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
