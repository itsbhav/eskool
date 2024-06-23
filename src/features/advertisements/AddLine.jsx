import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  useDeleteAdvertisementMutation,
  useGetAllAdvertisementsQuery,
} from "./advertisementApi";
import useAuth from "../../hooks/useAuth";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PulseLoader } from "react-spinners";
import { memo } from "react";
const AddLine = ({ id, pageNum }) => {
  const { pathname } = useLocation();
  const { userrole } = useAuth();
  const { advertisement } = useGetAllAdvertisementsQuery(pageNum, {
    selectFromResult: ({ data }) => ({
      advertisement: data?.entities[id] ?? "Not Found",
    }),
  });
  const [deleteAdv, { isSuccess, isError, isLoading, error }] =
    useDeleteAdvertisementMutation();
  const handleDelete = async () => {
    const result = await deleteAdv({ id });
  };
  return (
    <tr className="table__row">
      <td className="table__cell">
        {new Date(advertisement.timestamp).toLocaleString(undefined, {
          timeZone: "Asia/Kolkata",
        })}
      </td>
      <td className="table__cell">
        <Link to={advertisement.url} target="blank" style={{ color: "#000" }}>
          {advertisement.subject}
        </Link>
      </td>
      {pathname.toLowerCase() === "/advertisement" &&
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

export default memo(AddLine);
