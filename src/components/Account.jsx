import React from "react";
import useAuth from "../hooks/useAuth";
import {
  useConfirmedByTeacherMutation,
  useGetTeachersQuery,
  useVerifiedByTeacherMutation,
} from "../features/admin/adminApi";
import { memo } from "react";
import useTitle from "../hooks/useTitle";
const Account = () => {
  const { useremail, userrole } = useAuth();
  useTitle("Account Management");
  const { data: t, isSuccess: isTS } = useGetTeachersQuery();
  const [markVer, { isLoading: isML, isError: isME, error: mE }] =
    useVerifiedByTeacherMutation();
  const [markConfirm, { isLoading: isCL, isError: isCE, error: cE }] =
    useConfirmedByTeacherMutation();
  if (!useremail || userrole !== process.env.REACT_APP_ADMIN)
    return (
      <div className="public errmsg">Unauthorized: Please Login Again</div>
    );
  const handleAdminV = async (data) => {
    try {
      await markVer(data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleTeacherV = async (data) => {
    try {
      await markConfirm(data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <section className="public">
      <div>Teacher Management</div>
      <table className="table1">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th">
              Email
            </th>
            <th scope="col" className="table__th">
              Verified By Admin
            </th>
            <th scope="col" className="table__th">
              Confirmed By Teacher
            </th>
          </tr>
        </thead>
        <tbody>
          {isTS &&
            t.ids.map((id) => (
              <tr
                className="table__row"
                key={id}
                style={{
                  color: t.entities[id].email_verified ? "green" : "red",
                }}
              >
                <td className="table__cell">{t.entities[id].email}</td>
                <td
                  className="table__cell"
                  onDoubleClick={() =>
                    handleTeacherV({
                      verified_by_admin: !t.entities[id].verified_by_admin,
                      email: t.entities[id].email,
                    })
                  }
                >
                  <div>
                    {t.entities[id].verified_by_admin ? "True" : "False"}
                  </div>
                  <div>{isME ? mE?.data?.message || "Error" : ""}</div>
                </td>
                <td
                  className="table__cell"
                  onDoubleClick={() =>
                    handleAdminV({
                      verified_by_teacher: !t.entities[id].verified_by_teacher,
                      email: t.entities[id].email,
                    })
                  }
                >
                  <div>
                    {t.entities[id].verified_by_teacher ? "True" : "False"}
                  </div>
                  <div>{isCE ? cE?.data?.message || "Error" : ""}</div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  );
};

export default memo(Account);
