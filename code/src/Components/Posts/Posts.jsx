import Post from "../Post/Post";
import "./Posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Posts = ({userId}) => {
  const { isLoading, error, data } = useQuery({ queryKey: ["Posts"], queryFn:  () =>
  makeRequest.get("/Posts?userId="+userId).then((res) => {
    return res.data;
  })});

  return (
    <div className="posts">
      {error
        ? "Something went wrong!"
        : isLoading
        ? "loading"
        : data.map((post) => <Post post={post} key={post.PID} />)}
    </div>
  );
};

export default Posts;