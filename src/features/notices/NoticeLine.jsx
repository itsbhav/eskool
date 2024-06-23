import React from "react";
import { Link } from "react-router-dom";
import { useGetAllNoticesQuery } from "./noticeApi";
import { useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useDeleteNoticeMutation } from "./noticeApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { PulseLoader } from "react-spinners";
import { memo } from "react";
const NoticeLine = ({ id, pageNum }) => {
  const { pathname } = useLocation();
  const { userrole } = useAuth();
  const { notice } = useGetAllNoticesQuery(pageNum, {
    selectFromResult: ({ data }) => ({
      notice: data?.entities[id] ?? "Not Found",
    }),
  });
  const [deleteNotice, { isSuccess, isError, isLoading, error }] =
    useDeleteNoticeMutation();
  const handleDelete = async () => {
    const result = await deleteNotice({ id });
  };
  return (
    <tr className="table__row">
      <td className="table__cell">
        {new Date(notice.timestamp).toLocaleString(undefined, {
          timeZone: "Asia/Kolkata",
        })}
      </td>
      <td className="table__cell">
        <Link to={notice.url} target="blank" style={{ color: "#000" }}>
          {notice.subject}
        </Link>
      </td>
      {pathname.toLowerCase() === "/notice" &&
        userrole === process.env.REACT_APP_ADMIN && (
          <td className="table__cell">
            {!isLoading && !isError && (
              <button
                className="icon-button1"
                title="Delete"
                onClick={handleDelete}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            )}
            {isLoading && <PulseLoader color="#000" />}
            {isError && <div className="errmsg">{error?.data?.message}</div>}
          </td>
        )}
    </tr>
  );
};

export default memo(NoticeLine);
