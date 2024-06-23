import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  if (token) {
    const decoded = jwtDecode(token);
    const { useremail, userrole } = decoded.UserInfo;
    // console.log(useremail, userrole);
    return { useremail, userrole };
  }

  return { useremail: "", userrole: "" };
};
export default useAuth;
