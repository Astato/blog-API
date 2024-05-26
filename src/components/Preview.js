import newBlogPost from "../utils/newBlogPost";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import processTextarea from "../utils/markupParser";
import * as DOMPurify from "dompurify";

const Preview = ({ textareaInput, setShowPreview, state, setErrorMessage }) => {
  const [purifiedHtml, setPurifiedHtml] = useState(null);
  const navigate = useNavigate();

  const config = {
    ADD_TAGS: ["iframe"],
  };

  useEffect(() => {
    setPurifiedHtml(DOMPurify.sanitize(textareaInput, config));
  }, []);

  async function handleSubmitBlog() {
    if (state.title === "") {
      return setErrorMessage("You need to provide a Title!");
    } else if (state.description === "") {
      return setErrorMessage("You need to provide a Summary!");
    } else if (state.description.length < 100) {
      return setErrorMessage(
        "Please provide a longer Summary! (100 character minimun))"
      );
    } else if (state.categories.length === 0) {
      return setErrorMessage("You need to select at least 1 category!");
    } else if (state.blog_content.length < 200) {
      return setErrorMessage("You blog content is to short!");
    }

    const response = await newBlogPost(state);
    if (response === 200) {
      setShowPreview(false);
      return navigate("/discover");
    } else {
      setShowPreview(false);
      setErrorMessage("An internal Error has ocurred, please try again.");
    }
  }

  return (
    <div id="preview">
      <button onClick={() => setShowPreview(false)}>X</button>
      <button type="submit" onClick={() => handleSubmitBlog()}>
        Post!
      </button>

      <div
        id="textarea-preview"
        dangerouslySetInnerHTML={{ __html: purifiedHtml }}
      />
    </div>
  );
};

export default Preview;
