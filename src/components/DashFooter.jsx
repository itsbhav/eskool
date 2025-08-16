import React from "react";
import { Link } from "react-router-dom";
import usePersist from "../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { useRefreshMutation } from "../features/auth/authApiSlice";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { memo } from "react";
const DashFooter = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const [refresh, { isLoading, isSuccess, isError }] = useRefreshMutation();

  useEffect(() => {
    const refreshSend = async () => {
      await refresh();
    };
    if (persist && !token) {
      refreshSend();
    }
  }, [persist, refresh, token]);
  // const{useremail}=useAuth()
  // if (isSuccess) {
  //   // console.log(useremail)
  // }
  const year = new Date().getFullYear();
  return (
    <div className="footer">
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
        }}
      >
        <div className="footer-div">
          <Link
            to={`mailto:${process.env.REACT_APP_OFFICIAL_MAIL}`}
            style={{ color: "black" }}
          >
            Contact Us at {process.env.REACT_APP_OFFICIAL_MAIL}
          </Link>
        </div>
        <div className="footer-div">
          &copy; {year} | All Rights Reserved | eSkool
        </div>
        <div className="footer-div">
          First Release {process.env.REACT_APP_FIRST_RELEASE}
        </div>
        <div className="footer-div">
          Latest Update {process.env.REACT_APP_LATEST_UPDATE}
        </div>
        <div className="footer-div">
          <Link to={"/instructions"}>
            <button className="button">instructions</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default memo(DashFooter);
