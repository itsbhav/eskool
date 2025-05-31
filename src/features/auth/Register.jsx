import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import usePersist from "../../hooks/usePersist";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";
import { useAddNewStudentMutation } from "../user/userApi";
import { useAddNewTeacherMutation } from "../teacher/teacherApi";
import { useGetAllClassQuery } from "../classCourse/classCourseApi";

const Register = () => {
  useTitle("Account SignUp");

  const userRef = useRef();
  const errRef = useRef();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();
  const [inhouse, setInhouse] = useState(true);
  const [classid, setClassid] = useState(0);
  const [institute, setInstitute] = useState("");
  const [type, setType] = useState(process.env.REACT_APP_USER);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [addNewUser, { isLoading, isError, error, isSuccess }] =
    useAddNewStudentMutation();
  const [
    addNewTeacher,
    {
      isLoading: isTLoading,
      isError: isTError,
      error: tError,
      isSuccess: isTSuccess,
    },
  ] = useAddNewTeacherMutation();
  const {
    data: classes,
    isError: isClErr,
    error: clErr,
    isLoading: isClLoading,
    isSuccess: isClSucc,
  } = useGetAllClassQuery();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === process.env.REACT_APP_USER) {
        const { accessToken } = await addNewUser({
          name,
          pass: password,
          persist,
          inhouse,
          class_id: classid,
          email,
        }).unwrap();
        dispatch(setCredentials({ accessToken }));
      } else if (type === process.env.REACT_APP_TEACHER) {
        const { accessToken } = await addNewTeacher({
          name,
          pass: password,
          persist,
          institution: institute,
          email,
        }).unwrap();
        dispatch(setCredentials({ accessToken }));
      }
      setName("");
      setPassword("");
      setEmail("");
      setClassid(0);
      setInhouse(true);
      setInstitute("");
      navigate("/dash");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(err.data?.message);
      }
      setTimeout(() => errRef.current.focus(), 5000);
    }
  };

  const handleUserInput = (e) => setName(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist((prev) => !prev);
  const handleType = (e) => setType(e.target.value);
  const handleInst = (e) => setInstitute(e.target.value);
  const handleEmail = (e) => setEmail(e.target.value);
  const handleInHouse = () => setInhouse((prev) => !prev);
  const handleClass = (e) => setClassid(e.target.value);
  const errClass = errMsg ? "errmsg" : "offscreen";

  if (isLoading || isTLoading) return <PulseLoader color={"#FFF"} />;
  const content = (
    <section className="login-colorSetter logBg">
      <header className="login_header">
        <h1 className=" nowrap">Account SignUp</h1>
      </header>
      <main className="login">
        <p ref={errRef} className={errClass} aria-live="assertive">
          {errMsg}
        </p>
        <label htmlFor="type">
          Type of Account:
          <select
            name="type"
            id="type"
            className="form__input"
            onChange={handleType}
            required
          >
            <option value={process.env.REACT_APP_USER} selected>
              Student
            </option>
            <option value={process.env.REACT_APP_TEACHER}>Teacher</option>
          </select>
        </label>
        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="username">Name:</label>
          <input
            className="form__input"
            type="text"
            id="username"
            ref={userRef}
            value={name}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />
          <label htmlFor="email">Email:</label>
          <div>
            Please Provide correct mail id. You need to verify your mail to
            access portal via mail sent to you after registartion.
          </div>
          <input
            className="form__input"
            type="email"
            id="email"
            value={email}
            onChange={handleEmail}
            required
          />

          {type === process.env.REACT_APP_TEACHER && (
            <>
              <label htmlFor="institute">Institute:</label>
              <input
                className="form__input"
                type="text"
                id="institute"
                value={institute}
                onChange={handleInst}
                autoComplete="off"
                required
              />
            </>
          )}
          <label htmlFor="password">Password:</label>
          <input
            className="form__input"
            type="password"
            id="password"
            onChange={handlePwdInput}
            value={password}
            required
          />
          {type === process.env.REACT_APP_USER && (
            <>
              <label htmlFor="inhouse" className="form__persist">
                <input
                  className="form__checkbox"
                  type="checkbox"
                  id="inhouse"
                  checked={inhouse}
                  onChange={handleInHouse}
                />
                Whether Inhouse Student ?
              </label>
            </>
          )}

          {type === process.env.REACT_APP_USER && (
            <>
              <label htmlFor="classid">Select Class</label>
              <select
                name="classid"
                id="classid"
                className="form__input"
                onChange={handleClass}
                required
              >
                <option value="0">--Select*--</option>
                {!isClLoading &&
                  !isClErr &&
                  classes.ids.map((id) => (
                    <option value={id} key={id}>
                      {classes.entities[id].name}
                    </option>
                  ))}
                {isClLoading && "Loading..."}
              </select>
            </>
          )}
          <button className="form__submit-button">Sign Up</button>

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
    </section>
  );

  return content;
};
export default Register;
