import React from "react";
import useAuth from "../hooks/useAuth";
import useTitle from "../hooks/useTitle";
import { Link } from "react-router-dom";
import { memo } from "react";
const Dashboard = () => {
  const { useremail, userrole } = useAuth();
  useTitle(`eSkool:Dashboard`);
  if (!useremail || !userrole)
    return <div className="public errmsg">Unauthorized: Login Again</div>;
  return (
    <div className="dash-div">
      <ul className="dash-list">
        {userrole === process.env.REACT_APP_ADMIN && (
          <li>
            <Link to="/accounts" className="dash-link">
              Manage Account
            </Link>
          </li>
        )}
        {userrole === process.env.REACT_APP_ADMIN && (
          <>
            <li>
              <Link to="/advertisement" className="dash-link">
                Manage Advertisement
              </Link>
            </li>
            <li>
              <Link to="/notice" className="dash-link">
                Manage Notice
              </Link>
            </li>
            <li>
              <Link to="/class" className="dash-link">
                Manage Class
              </Link>
            </li>
          </>
        )}
        {(userrole === process.env.REACT_APP_ADMIN ||
          userrole === process.env.REACT_APP_USER) && (
          <li>
            <Link to="/fee" className="dash-link">
              Manage Fee
            </Link>
          </li>
        )}
        {(userrole === process.env.REACT_APP_ADMIN ||
          userrole === process.env.REACT_APP_USER) && (
          <li>
            <Link to="/marks" className="dash-link">
              Manage Marks
            </Link>
          </li>
        )}
        {userrole !== process.env.REACT_APP_USER && (
          <li>
            <Link to="/managec" className="dash-link">
              Manage Course
            </Link>
          </li>
        )}
        {userrole === process.env.REACT_APP_USER && (
          <li>
            <Link to="/managec" className="dash-link">
              Study Now!!
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default memo(Dashboard);
