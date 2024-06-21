import axios from "axios";
import { parse } from "himalaya";
import { BASEURL } from "../App";
async function newBlogPost(blog, isEdit) {
  blog.date = new Date().toISOString();
  blog.blog_content = parse(blog.blog_content);
  blog.isEdit = isEdit;
  const options = {
    method: "POST",
    url: BASEURL + "/api/blogs/newblogpost",
    data: blog,
    headers: { "Content-Type": "application/json" },
  };

  try {
    const response = await axios(options);
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    console.log(error);
  }
}

export default newBlogPost;
