import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import usePersist from "../hooks/usePersist";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";
import { faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import { useLocation } from "react-router-dom";
const DashHeader = () => {
  const [persist, setPersist] = usePersist();
  const { useremail, userrole } = useAuth();

  const navigate = useNavigate();
  const { pathname } = useLocation();
  // console.log(pathname)
  const [sendLogout, { isSuccess, isError, error }] = useSendLogoutMutation();

  const handleLogout = async () => {
    await sendLogout();
  };
  const onUserButtonClicked = () => {
    // console.log(pathname);
    if (pathname.toLocaleLowerCase() === "/dash") navigate("/profile");
    else navigate("/dash");
  };
  useEffect(() => {
    if (isSuccess || isError) {
      setPersist(false);
      setTimeout(() => navigate("/"), 1000);
    }
  }, [isSuccess, isError, setPersist, navigate]);
  let logoutButton = null;
  let profileButton = null;
  // console.log(useremail, userrole);
  if (useremail.length) {
    logoutButton = (
      <button className="icon-button" title="Logout" onClick={handleLogout}>
        <FontAwesomeIcon icon={faRightFromBracket} />
      </button>
    );
    profileButton = (
      <button
        className="icon-button"
        title="My Profile"
        onClick={onUserButtonClicked}
      >
        <FontAwesomeIcon icon={faUser} />
      </button>
    );
  }
  const errClass = isError ? "errmsg" : "offscreen";

  return (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <header className="dash-header">
        <div className="dash-header__container">
          <Link to="/">
            <h1 className="dash-header__title">eSkool</h1>
          </Link>
          <nav className="dash-header__nav">
            {
              <>
                {}
                {!useremail && (
                  <Link to={"/course"}>
                    <button
                      className="dash-header__title button"
                      style={{ margin: "0.3rem 0 0 0" }}
                    >
                      Our Courses
                    </button>
                  </Link>
                )}
                {useremail.length ? (
                  <>
                    <Link to={"/courses"}>
                      <button
                        className="dash-header__title button"
                        style={{ margin: "0.3rem 0 0 0" }}
                      >
                        Our Courses
                      </button>
                    </Link>
                    {logoutButton}
                    {profileButton}
                  </>
                ) : (
                  <>
                    {pathname.toLowerCase() !== "/login" ? (
                      <Link to={"/login"}>
                        <button className="dash-header__title button">
                          LogIn
                        </button>
                      </Link>
                    ) : (
                      <Link to={"/register"}>
                        <button className="dash-header__title button">
                          New User SignUp
                        </button>
                      </Link>
                    )}
                  </>
                )}
              </>
            }
          </nav>
        </div>
      </header>
    </>
  );
};

export default memo(DashHeader);
