import { useState } from "react";
import { useNavigate } from "react-router-dom";
import mailchecker from "mailchecker";
import facebookLogo from "../icons/facebook-icon.jpeg";
import googleLogo from "../icons/google-icon.png";
import userAuthPost from "../utils/userAuthPost";
import newUserPost from "../utils/newUserPost";
import DOMPurify from "dompurify";
const SignIn = ({ setClientLogged }) => {
  const [signup, setSignUp] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailRepeatInput, setEmailRepeatInput] = useState("");
  const [passwordIInput, setPasswordInput] = useState("");
  const [passwordRepeatInput, setPasswordRepeatInput] = useState("");
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const navigate = useNavigate();

  const handleAttemptLogin = async (e, isTest) => {
    e.preventDefault();
    let email;
    let password;
    if (isTest) {
      email = "1234@1234.com";
      password = "123";
    }
    if (!isTest) {
      email = e.target.email.value;
      password = e.target.password.value;
    }
    const response = await userAuthPost(email, password);
    if (!response) {
      setInvalidCredentials("Couldn't connect to the server");
      return;
    }
    if (response.status !== 200) {
      setInvalidCredentials(response.data.message);
    } else {
      setInvalidCredentials(false);
      setClientLogged({
        name: response.data.user.name,
        lastname: response.data.user.lastname,
        _id: response.data.user._id,
      });
      return navigate(
        "/profile/" + response.data.user.name + response.data.user.lastname
      );
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (
      emailInput === emailRepeatInput &&
      passwordIInput === passwordRepeatInput &&
      mailchecker.isValid(emailInput)
    ) {
      const name = DOMPurify.sanitize(e.target.name.value);
      const lastname = DOMPurify.sanitize(e.target.lastname.value);
      const response = await newUserPost(
        emailInput,
        name,
        lastname,
        DOMPurify.sanitize(passwordIInput)
      );
      if (response.status === 200) {
        setClientLogged({
          name: response.data.createNewUser.name,
          lastname: response.data.createNewUser.lastname,
          _id: response.data.createNewUser._id,
        });

        return navigate(
          "/profile/" +
            response.data.createNewUser.name +
            response.data.createNewUser.lastname
        );
      }
    } else {
      return;
    }
  };

  // const handleLogout = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:5000/api/blogs/logout"
  //     );
  //     if (response.status === 200) {
  //       return navigate("/profile");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // if (userIsLogged || userProfile) {
  //   const { name, lastname, posts, comments, drafts, email } = userProfile;
  //   return (
  //     <div id="user-profile">
  //       <h1>My Profile</h1>
  //       <h2>
  //         {name}, {lastname}
  //       </h2>
  //       <h3>{email}</h3>
  //       <h1>My Posts</h1>
  //       {posts.length === 0 ? <p>This looks to empty...</p> : null}
  //       <h1>My Comments </h1>
  //       {comments.length === 0 ? <p>Nothing to see here...</p> : null}
  //       <h1>My Drafts</h1>
  //       {drafts.length === 0 ? <p>No saved drafts...</p> : null}
  //       <button onClick={handleLogout}>Logout</button>
  //     </div>
  //   );
  // }

  if (!signup) {
    return (
      <div id="profile">
        <form onSubmit={handleAttemptLogin}>
          <h1>Sing in</h1>
          <label>
            Email:
            <input type="email" name="email" required autoComplete="true" />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              required
              autoComplete="true"
            />
          </label>
          {invalidCredentials ? (
            <p style={{ margin: ".5rem auto", color: "rgb(256, 60, 60)" }}>
              {invalidCredentials}
            </p>
          ) : null}

          <div style={{ margin: "1.5rem auto" }}>
            <button type="submit">Log in</button>
            <button id="sign-up" type="button" onClick={() => setSignUp(true)}>
              Sign up
            </button>
          </div>
          {/* <p style={{ textAlign: "center", margin: "auto" }}>Or</p> */}
          <div id="thirdparty-auth">
            <a href="http://localhost:5000/api/oauth2/redirect/google">
              <button type="button" className="thirdparty-login-btn">
                <img
                  src={googleLogo}
                  alt="Sign up with google"
                  aria-label="sign up with google"
                />
                Continue with Google
              </button>
            </a>
            <button
              type="button"
              className="thirdparty-login-btn"
              onClick={(e) => handleAttemptLogin(e, true)}
            >
              Continue with a Test user
            </button>
            {/* <button type="button" className="thirdparty-login-btn">
              <img
                src={facebookLogo}
                alt="Sign up with facebook"
                aria-label="sign up with facebook"
              />
              Continue with Facebook
            </button> */}
          </div>
        </form>
      </div>
    );
  } else {
    return (
      <div id="profile">
        <button onClick={() => setSignUp(false)}>Back</button>
        <form onSubmit={handleCreateUser}>
          <h1>Sing Up</h1>
          <label>
            * Name:
            <input type="text" name="name" required />
          </label>
          <label>
            * Lastname:
            <input type="text" name="lastname" required />
          </label>
          <label>
            * Email:
            <input
              type="email"
              name="email"
              required
              onChange={(e) => setEmailInput(e.target.value)}
              value={emailInput}
              autoComplete="email"
            />
            {!mailchecker.isValid(emailInput) ? (
              <div
                style={{
                  textAlign: "center",
                  margin: "0 auto",
                  color: "red",
                }}
              >
                Email is not Valid
              </div>
            ) : null}
          </label>
          <label>
            * Repeat Email:
            <input
              type="email"
              name="emailRepeat"
              required
              onChange={(e) => setEmailRepeatInput(e.target.value)}
              value={emailRepeatInput}
              autoComplete="email"
            />
            {emailInput !== emailRepeatInput ? (
              <div
                style={{
                  textAlign: "center",
                  margin: "0 auto",
                  color: "red",
                }}
              >
                Emails don't match.
              </div>
            ) : null}
          </label>
          <label>
            * Password:
            <input
              type="password"
              name="password"
              required
              onChange={(e) => setPasswordInput(e.target.value)}
              value={passwordIInput}
              autoComplete="new-password"
            />
          </label>
          <label>
            * Repeat Password:
            <input
              type="password"
              name="passwordRepeat"
              required
              onChange={(e) => setPasswordRepeatInput(e.target.value)}
              value={passwordRepeatInput}
              autoComplete="new-password"
            />
            {passwordIInput !== passwordRepeatInput ? (
              <div
                style={{
                  textAlign: "center",
                  margin: "0 auto",
                  color: "red",
                }}
              >
                Passwords don't match.
              </div>
            ) : null}
          </label>
          <div>
            <button type="submit">Sign up</button>
          </div>
        </form>
      </div>
    );
  }
};

export default SignIn;
