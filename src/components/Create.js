import { useEffect, useReducer, useRef, useState, Component } from "react";
import helpIcon from "../icons/help._icon.svg";
import DOMPurify from "dompurify";
import newBlogReducer from "../utils/newBlogReducer";
import Preview from "./Preview";
import { stringify } from "himalaya";
import { Link } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build/build/ckeditor";

const defaultState = {
  title: "",
  description: "",
  blog_content: "",
  categories: "",
};

const Create = ({ clientLogged, editBlog }) => {
  const [textareaInput, setTextAreaInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [state, dispatch] = useReducer(newBlogReducer, defaultState);
  const [errorMessage, setErrorMessage] = useState("");
  const dialogRef = useRef(null);
  const errorDialogRef = useRef(null);
  const formRef = useRef(null);
  const handlePreview = () => {
    setShowPreview((prev) => !prev);
  };

  const handleSubmit = () => {
    const user = clientLogged._id;
    const form = formRef.current;
    const categoriesCheckbox = Array.from(form.elements);
    const checkboxArray = [];
    for (const element of categoriesCheckbox) {
      if (element.type === "checkbox" && element.checked) {
        checkboxArray.push(element.name);
      }
    }

    dispatch({
      type: "NEW_BLOG",
      title: DOMPurify.sanitize(form.title.value),
      description: DOMPurify.sanitize(form.description.value),
      categories: checkboxArray,
      creatorID: user,
      creatorName: clientLogged.name + " " + clientLogged.lastname,
      blog_content: textareaInput,
    });
  };

  return (
    <div id="create">
      <h1 className="section-title">Create !</h1>

      <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
        <p style={{ textAlign: "center", fontSize: "24px" }}>
          Choose categories:
        </p>
        <div id="categories-checkbox">
          <label>
            Technology
            <input name="technology" type="checkbox"></input>
          </label>
          <label>
            Lifestyle
            <input name="lifestyle" type="checkbox"></input>
          </label>

          <label>
            Creativity
            <input name="creativity" type="checkbox"></input>
          </label>
          <label>
            Food
            <input name="food" type="checkbox"></input>
          </label>

          <label>
            Travel
            <input name="travel" type="checkbox"></input>
          </label>
          <label>
            Enviorment
            <input name="enviorment" type="checkbox"></input>
          </label>
          <label>
            Music
            <input name="music" type="checkbox"></input>
          </label>
          <label>
            Others
            <input name="others" type="checkbox"></input>
          </label>
        </div>
        <div id="blog-create">
          <label>
            Title:
            <textarea
              style={{ marginLeft: "6.6rem" }}
              type="text"
              name="title"
              id="title"
              rows={4}
              cols={33}
              onKeyDown={(e) => setDescription(e.target.value)}
              defaultValue={editBlog ? editBlog.title : ""}
            ></textarea>
          </label>
          <label>
            Summary:
            <textarea
              type="text"
              name="description"
              rows={4}
              cols={33}
              defaultValue={editBlog ? editBlog.description : ""}
            ></textarea>
          </label>
          <div id="editor-container">
            <label
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              Your awesome blog!
            </label>
            <CKEditor
              editor={Editor}
              data={
                editBlog
                  ? stringify(editBlog.blog_content)
                  : null || "<p>Start Creating!</p>"
              }
              config={{ mediaEmbed: { previewsInData: true } }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setTextAreaInput(data);
              }}
            ></CKEditor>
          </div>
        </div>
        {clientLogged ? (
          <div style={{ margin: "auto" }}>
            <dialog ref={dialogRef}>
              <p>
                <strong>Caution:</strong> you are about to delete everything!
              </p>
              <button
                type="button"
                className="reset-button"
                onClick={() => {
                  {
                    setTextAreaInput("");
                    dialogRef.current.close();
                  }
                }}
              >
                Accept
              </button>
              <button type="button" onClick={() => dialogRef.current.close()}>
                Cancel
              </button>
            </dialog>
            <button
              type="button"
              onClick={() => {
                handlePreview();
                handleSubmit();
              }}
            >
              Preview!
            </button>
            <button
              className="reset-button"
              id="reset-button"
              type="button"
              onClick={() => dialogRef.current.showModal()}
            >
              Reset
            </button>
            <button style={{ backgroundColor: "#02bda4" }}>Save Draft</button>
          </div>
        ) : (
          <Link
            to="/sign-in"
            style={{ fontSize: "30px", color: "#008fe2", margin: "2rem auto" }}
          >
            Login to start inspiring!
          </Link>
        )}
      </form>
      {showPreview ? (
        <Preview
          textareaInput={textareaInput}
          setShowPreview={setShowPreview}
          setErrorMessage={setErrorMessage}
          state={state}
        />
      ) : (
        <></>
      )}
      {errorMessage ? errorDialogRef.current.showModal() : null}
      <dialog ref={errorDialogRef} id="error-message">
        <h2>{errorMessage}</h2>
        <button
          onClick={() => {
            errorDialogRef.current.close();
            setErrorMessage("");
          }}
        >
          Got it
        </button>
      </dialog>
    </div>
  );
};

export default Create;

{
  /* <div id="tooltip">
                <p>
                  <img src={helpIcon} alt="Help" />
                  {"\t"}Instructions
                </p>

                <ul id="tooltip-text">
                  <li
                    className="instructions-caution"
                    style={{ margin: 0, textAlign: "left" }}
                  >
                    This is a custom markup parser. The objective is to provide
                    text editing and add simplicity.
                  </li>
                  <li>
                    Click the elements on the side to add your elements. ¡¡ If
                    you are feeling adventurous you can can write them your self
                    !!
                  </li>
                  <li>
                    You can add a text element if you want to edit the font size
                    or color, for a black default text, just write it outside
                    the other elements.
                  </li>
                  <li>
                    You can change the color of the text by chaging the value in
                    color. e.g: *T color=red or color=rgb(255,40,30)*.
                  </li>
                  <li>
                    You can change the font size by changing the value in size,
                    e.g: size=54.
                  </li>
                  <li>
                    To write a list place a ">" before the text. Tip: you can
                    add links to your list, e.g: >*K color=black, size=14,
                    link=https://www.google.com*Link to google*K*
                  </li>

                  <li>
                    To add a link just place the link in the element. Just make
                    suure the link contains the https://. e.g:
                    https://www.facebook.com
                  </li>
                  <li>
                    To add an image place the link to the image, Make sure that
                    the link is to the actual image or it won't be displayed.
                  </li>
                  <li className="instructions-caution">
                    ** If your elements are not being displayed correctly or are
                    improperly displayed, please check for mistakes and ensure
                    that you are following the provided templates.
                  </li>
                </ul>
              </div> */
}
{
  /* <textarea
                name="content"
                id="textarea"
                onChange={(e) => setTextAreaInput(e.target.value)}
                value={textareaInput}
              ></textarea> */
}

{
  /* <ul id="add-elements-container">
              <p>Add Elements</p>
              <li onClick={() => addElements("title")}>Title</li>
              <li onClick={() => addElements("subtitle")}>Subtitle</li>
              <li onClick={() => addElements("text")}>Text</li>
              <li onClick={() => addElements("numbered_list")}>
                Numbered List
              </li>
              <li onClick={() => addElements("list")}>List</li>
              <li onClick={() => addElements("indent")}>Indent</li>
              <li onClick={() => addElements("image")}>Image</li>
              <li onClick={() => addElements("link")}>Link</li>
            </ul> */
}

// const addElements = (ele) => {
//   switch (ele) {
//     case "title":
//       setTextAreaInput(
//         (prev) => prev + "*T color=black, size=54*Your title*T*"
//       );
//       return;
//     case "subtitle":
//       setTextAreaInput(
//         (prev) => prev + "*S color=black, size=38*Your subtitle*S*"
//       );
//       return;
//     case "numbered_list":
//       setTextAreaInput(
//         (prev) => prev + "*N color=black, size=18* \n>item 1 \n>item2 \n*N*"
//       );
//       return;
//     case "list":
//       setTextAreaInput(
//         (prev) => prev + "*L color=black, size=18* \n>item 1 \n>item2 \n*L*"
//       );
//       return;
//     case "indent":
//       setTextAreaInput(
//         (prev) => prev + "*i color=black, size=18*Your text*i*"
//       );
//       return;
//     case "text":
//       setTextAreaInput(
//         (prev) => prev + "*t color=black, size=18*Your text*t*"
//       );
//       return;
//     case "link":
//       setTextAreaInput(
//         (prev) =>
//           prev +
//           "*K color=blue, size=18, link=https://www.google.com*Your Link*K*"
//       );
//       return;
//     case "image":
//       setTextAreaInput((prev) => prev + "  \n*I size=500*Your Image Link*I*");
//       return;
//   }
// };
