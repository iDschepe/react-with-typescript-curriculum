import React from "react";
import { IPost } from "../utils/api";
import PostMetaInfo from "./PostMetaInfo";

export default function Comment({
  comment,
}: {
  comment: Pick<IPost, "by" | "time" | "id" | "descendants" | "text">;
}) {
  return (
    <div className="comment">
      <PostMetaInfo
        by={comment.by}
        time={comment.time}
        id={comment.id}
        descendants={comment.descendants}
      />
      <p dangerouslySetInnerHTML={{ __html: comment.text }} />
    </div>
  );
}
