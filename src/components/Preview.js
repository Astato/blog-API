import newBlogPost from "../utils/newBlogPost";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as DOMPurify from "dompurify";

const Preview = ({
  textareaInput,
  setShowPreview,
  state,
  setErrorMessage,
  isEdit,
  setOpenBlog,
}) => {
  const [purifiedHtml, setPurifiedHtml] = useState(null);
  const navigate = useNavigate();

  const config = {
    ADD_TAGS: ["iframe"],
  };

  useEffect(() => {
    setPurifiedHtml(DOMPurify.sanitize(textareaInput, config));
  }, [textareaInput]);

  async function handleSubmitBlog() {
    if (state.title === "") {
      return setErrorMessage("You need to provide a Title!");
    } else if (state.description === "") {
      return setErrorMessage("You need to provide a Summary!");
    } else if (state.description.length < 50) {
      return setErrorMessage(
        `Please provide a longer Summary! Current count is ${
          state.description.length || 0
        } characters! (At least 50 required)`
      );
    } else if (state.categories.length === 0) {
      return setErrorMessage("You need to select at least 1 category!");
    } else if (state.blog_content.length < 200) {
      return setErrorMessage("You blog content is to short!");
    }

    const response = await newBlogPost(state, isEdit);
    if (response.status === 200) {
      setShowPreview(false);
      if (response.data._id) {
        setOpenBlog(response.data);
        return navigate("/blogs/" + response.data._id);
      } else {
        return navigate("/discover");
      }
    } else {
      setShowPreview(false);
      setErrorMessage("An internal Error has ocurred, please try again.");
    }
  }

  return (
    <div id="preview">
      <button onClick={() => setShowPreview(false)}>X</button>
      <button type="submit" onClick={() => handleSubmitBlog()}>
        {isEdit ? "Edit" : "Post"}
      </button>

      <div
        id="textarea-preview"
        dangerouslySetInnerHTML={{ __html: purifiedHtml }}
      />
    </div>
  );
};

export default Preview;
