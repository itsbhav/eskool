import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";

const Login = () => {
  useTitle("Account Login");
  const userRef = useRef();
  const errRef = useRef();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(0);
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({
        role,
        password,
        persist,
        email,
      }).unwrap();
      dispatch(setCredentials({ accessToken }));
      // console.log(accessToken)
      setEmail("");
      setRole(0);
      setPassword("");
      setRole("");
      navigate("/dash");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Email or Password");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(err.data?.message);
      }
      setTimeout(() => errRef.current.focus(), 5000);
    }
  };

  const handleUserInput = (e) => setEmail(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist((prev) => !prev);
  const handleRole = (e) => setRole(e.target.value);
  // console.log(role)
  const errClass = errMsg ? "errmsg" : "offscreen";

  if (isLoading) return <PulseLoader color={"#FFF"} />;
  const content = (
    <section className="login-colorSetter logBg" style={{ padding: "1.5rem" }}>
      <header className="login_header">
        <h1 className="nowrap">Account Login</h1>
      </header>
      <main className="login">
        <p ref={errRef} className={errClass} aria-live="assertive">
          {errMsg}
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            className="form__input"
            type="email"
            id="email"
            ref={userRef}
            value={email}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            className="form__input"
            type="password"
            id="password"
            onChange={handlePwdInput}
            value={password}
            required
          />
          <label htmlFor="role">
            Select Role:
            <select
              id="role"
              className="form__input"
              onChange={handleRole}
              required
            >
              <option value="0">--Select*--</option>
              <option value={process.env.REACT_APP_ADMIN}>Admin</option>
              <option value={process.env.REACT_APP_USER}>Student</option>
              <option value={process.env.REACT_APP_TEACHER}>Teacher</option>
            </select>
          </label>
          <button className="form__submit-button">Sign In</button>
          <button type="button" className="form__submit-button">
            <Link to="/recoverPassword" style={{ color: "black" }}>
              Forgot Password
            </Link>
          </button>
          <label htmlFor="persist" className="form__persist">
            <input
              type="checkbox"
              className="form__checkbox"
              id="persist"
              onChange={handleToggle}
              checked={persist}
            />
            Trust This Device
          </label>
        </form>
      </main>
      <footer className="login-footer">
        <div
          onClick={(e) => {
            setPersist(false);
            setTimeout(() => {
              navigate("/");
            }, 1000);
          }}
        >
          Back to Home
        </div>
      </footer>
    </section>
  );

  return content;
};

export default Login;
