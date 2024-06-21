import axios from "axios";
import { BASEURL } from "../App";
async function newUserPost(email, name, lastname, password) {
  const options = {
    method: "POST",
    url: BASEURL + "/api/blogs/newuser",
    data: {
      email,
      name,
      lastname,
      password,
    },
    headers: { "Content-Type": "application/json" },
  };
  try {
    const response = await axios(options);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export default newUserPost;
