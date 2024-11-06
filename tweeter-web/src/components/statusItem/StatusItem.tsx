import { Status, User } from "tweeter-shared";
import Post from './Post';
import { Link } from "react-router-dom";
import useUserNavigationListener from "../userInfo/UserNavigationHook";

interface Props {
  status: Status;
}

const StatusItem = (props: Props) => {
  const { navigateToUser } = useUserNavigationListener();

	props.status.user as unknown as JSON;
	const userJson = JSON.stringify(props.status.user);
	const user = User.fromJson(userJson);

  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <div className="col-auto p-3">
            <img
              src={user?.imageUrl}
              className="img-fluid"
              width="80"
              alt="Posting user"
            />
          </div>
          <div className="col">
            <h2>
              <b>
                {user?.firstName} {user?.lastName}
              </b>{" "}
              -{" "}
              <Link
                to={user?.alias!}
                onClick={(event) => navigateToUser(event)}
              >
                {user?.alias}
              </Link>
            </h2>
            {props.status.formattedDate}
            <br />
            <Post status={props.status} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatusItem;