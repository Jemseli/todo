import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/useUser";

export const AuthenticationMode = Object.freeze({
  SignIn: "SignIn",
  SignUp: "SignUp",
});

export default function Authentication({ authenticationMode }) {
  const { user, setUser, signUp, signIn } = useUser();
  const navigate = useNavigate();

  const isSignIn = authenticationMode === AuthenticationMode.SignIn;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const signFunction = isSignIn ? signIn : signUp;

    signFunction()
      .then((response) => {
        navigate(isSignIn ? "/" : "/signin");
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <div>
      <h3>{isSignIn ? "Sign in" : "Sign up"}</h3>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input placeholder="Email" type="email" />

        <label>Password</label>
        <input placeholder="Password" type="password" />

        <button type="submit">{isSignIn ? "Login" : "Submit"}</button>
      </form>

      <Link to={isSignIn ? "/signup" : "/signin"}>
        {isSignIn ? "No account? Sign up" : "Already signed up? Sign in"}
      </Link>
    </div>
  );
}

