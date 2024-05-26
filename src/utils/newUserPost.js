import axios from "axios";

async function newUserPost(email, name, lastname, password) {
  console.log(email, name, lastname, password);
  const options = {
    method: "POST",
    url: "http://localhost:5000/api/blogs/newuser",
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
