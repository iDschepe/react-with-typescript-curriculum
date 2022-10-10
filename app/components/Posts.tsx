import React from "react";
import PropTypes from "prop-types";
import { fetchMainPosts, FetchType, IPost } from "../utils/api";
import Loading from "./Loading";
import PostsList from "./PostsList";

type PostAction =
  | {
      type: "fetch";
    }
  | {
      type: "success";
      posts: IPost[];
    }
  | {
      type: "error";
      error: string;
    };

interface PostState {
  posts: null | IPost[];
  error: null | string;
  loading: boolean;
}

function postsReducer(state: PostState, action: PostAction): PostState {
  if (action.type === "fetch") {
    return {
      ...state,
      posts: null,
      error: null,
      loading: true,
    };
  } else if (action.type === "success") {
    return {
      ...state,
      posts: action.posts,
      error: null,
      loading: false,
    };
  } else if (action.type === "error") {
    return {
      ...state,
      posts: null,
      error: action.error,
      loading: false,
    };
  } else {
    throw new Error(`That action type is not supported.`);
  }
}

export default function Posts({ type }: { type: FetchType }) {
  const [state, dispatch] = React.useReducer(postsReducer, {
    posts: null,
    error: null,
    loading: true,
  });

  React.useEffect(() => {
    dispatch({ type: "fetch" });

    fetchMainPosts(type)
      .then((posts) => dispatch({ type: "success", posts }))
      .catch(({ message }: { message: string }) =>
        dispatch({ type: "error", error: message })
      );
  }, [type]);

  if (state.loading === true) {
    return <Loading />;
  }

  if (state.error || !state.posts) {
    return <p className="center-text error">{state.error}</p>;
  }

  return <PostsList posts={state.posts} />;
}

Posts.propTypes = {
  type: PropTypes.oneOf(["top", "new"]),
};
