import "./PostStatus.css";
import { useState } from "react";
import useToastListener from "../toaster/ToastListenerHook";
import UserInfoHook from "../userInfo/UserInfoHook";
import { PostStatusPresenter, PostStatusView } from "../../presenters/PostStatusPresenter";

interface Props {
	presenterGenerator: (view: PostStatusView) => PostStatusPresenter;
	presenter?: PostStatusPresenter;
}

const PostStatus = (props: Props) => {
  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } =
    useToastListener();

  const { currentUser, authToken } = UserInfoHook();
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

	const submitPost = async (event: React.MouseEvent) => {
		presenter.submitPost(event, post, currentUser, authToken);
	}

  const clearPost = (event: React.MouseEvent) => {
    presenter.clearPost(event);
  };

	const listener: PostStatusView = {
		setIsLoading: setIsLoading,
		setPost: setPost,
		displayErrorMessage: displayErrorMessage,
		displayInfoMessage: displayInfoMessage,
		clearLastInfoMessage: clearLastInfoMessage,
	}

	const [presenter] = useState(props.presenterGenerator(listener));

  const checkButtonStatus: () => boolean = () => {
    return !post.trim() || !authToken || !currentUser;
  };

  return (
    <div className={isLoading ? "loading" : ""}>
      <form>
        <div className="form-group mb-3">
          <textarea
						aria-label="postStatusField"
            className="form-control"
            id="postStatusTextArea"
            rows={10}
            placeholder="What's on your mind?"
            value={post}
            onChange={(event) => {
              setPost(event.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <button
            id="postStatusButton"
						aria-label="post"
            className="btn btn-md btn-primary me-1"
            type="button"
            disabled={checkButtonStatus()}
            style={{ width: "8em" }}
            onClick={(event) => submitPost(event)}
          >
            {isLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              <div>Post Status</div>
            )}
          </button>
          <button
            id="clearStatusButton"
						aria-label="clear"
            className="btn btn-md btn-secondary"
            type="button"
            disabled={checkButtonStatus()}
            onClick={(event) => clearPost(event)}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostStatus;
