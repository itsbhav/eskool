import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import {
  useAddFeeByClassMutation,
  useMarkFeeMutation,
  useGetAllFeeQuery,
} from "../features/admin/adminApi";
import { useGetAllClassQuery } from "../features/classCourse/classCourseApi";
import { useGetYourFeeQuery } from "../features/user/userApi";
import { PulseLoader } from "react-spinners";
import { memo } from "react";
import useTitle from "../hooks/useTitle";
const FeeManagement = () => {
  useTitle("Fee Dash");
  const { useremail, userrole } = useAuth();
  const [addFee, { isLoading, isError, isSuccess, error }] =
    useAddFeeByClassMutation();
  const [
    markFee,
    { isLoading: isML, isError: isMErr, isSuccess: isMS, error: mErr },
  ] = useMarkFeeMutation();
  const {
    data: feeList,
    isLoading: isAFL,
    isError: isAFErr,
    error: aFErr,
    isSuccess: isAFSucc,
  } = useGetAllFeeQuery();
  const {
    data: myFee,
    isLoading: isMyFL,
    isError: isMyFErr,
    error: myFErr,
    isSuccess: isMyFSucc,
  } = useGetYourFeeQuery();
  const {
    data: classes,
    isError: isClErr,
    error: clErr,
    isLoading: isClLoading,
    isSuccess: isClSucc,
  } = useGetAllClassQuery();
  const [classid, setClassid] = useState(0);
  const [amount, setAmount] = useState(0);
  const [feeid, setFeeid] = useState(0);
  if (!useremail || !userrole)
    return (
      <div className="errmsg public">Unauthorized, Please Login Again!</div>
    );
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(classid, amount);
    try {
      const result = await addFee({ class_id: classid, amount });
    } catch (err) {
      console.log(err);
    }
    setAmount(0);
    setClassid(0);
  };
  const handleMark = async (e) => {
    e.preventDefault();
    try {
      const result = await markFee({
        id: feeid,
        paid: !feeList.entities[feeid].paid,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleClass = (e) => setClassid(e.target.value);
  const handleAmount = (e) => setAmount(e.target.value);
  const handleFee = (e) => {
    setFeeid(e.target.value);
  };
  return (
    <section className="public">
      {userrole === process.env.REACT_APP_ADMIN && (
        <>
          <div>Add Fee</div>
          {isError && (
            <div className="errmsg">{error?.data?.message || "Error"}</div>
          )}
          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="classid">
              Select Class {"  "}
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
            </label>
            <label htmlFor="amount">
              Amount:{"   "}
              <input
                type="number"
                name="amount"
                id="amount"
                value={amount}
                onChange={handleAmount}
              />
            </label>
            <button className="form__submit-button">
              {!isLoading && "Add Fee"}
              {isLoading && <PulseLoader color="black" />}
            </button>
          </form>
          <div>Mark Fee</div>
          {isMErr && (
            <div className="errmsg">{mErr?.data?.message || "Error"}</div>
          )}
          <form className="form" onSubmit={handleMark}>
            <label htmlFor="feeid">
              Select Fee {"  "}
              <select
                name="feeid"
                id="feeid"
                className="form__input"
                onChange={handleFee}
                required
              >
                <option value="0">--Select*--</option>
                {!isAFL &&
                  !isAFErr &&
                  feeList.ids.map((id) => (
                    <option
                      value={id}
                      key={id}
                      style={
                        !feeList.entities[id].paid
                          ? { color: "red" }
                          : { color: "green" }
                      }
                    >
                      FeeId: {feeList.entities[id].id}, FeeAmt:{" "}
                      {feeList.entities[id].amount},Student:{" "}
                      {feeList.entities[id].roll}
                    </option>
                  ))}
                {isAFL && "Loading..."}
              </select>
            </label>
            <button className="form__submit-button">
              {!isML && "Mark It"}
              {isML && <PulseLoader color="black" />}
            </button>
          </form>
        </>
      )}
      {userrole === process.env.REACT_APP_USER && (
        <>
          <div>Your Fee</div>
          <table className="table1">
            <thead className="table__thead">
              <tr>
                <th scope="col" className="table__th">
                  Fee Id
                </th>
                <th scope="col" className="table__th">
                  Fee Amount
                </th>
                <th scope="col" className="table__th">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {isMyFErr && (
                <div className="errmasg">
                  {myFErr?.data?.message || "Error"}
                </div>
              )}
              {!isMyFL &&
                !isMyFErr &&
                myFee.ids.map((id) => (
                  <tr key={id} className="table__row">
                    <td className="table__cell">{myFee.entities[id].id}</td>
                    <td className="table__cell">{myFee.entities[id].amount}</td>
                    <td className="table__cell">
                      {myFee.entities[id].paid ? "PAID" : "UNPAID"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
};

export default memo(FeeManagement);
