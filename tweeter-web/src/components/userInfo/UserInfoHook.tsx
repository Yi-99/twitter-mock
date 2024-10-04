import { useContext } from "react";
import { UserInfoContext } from "./UserInfoProvider";

const UserInfoListener = () => useContext(UserInfoContext);

export default UserInfoListener;