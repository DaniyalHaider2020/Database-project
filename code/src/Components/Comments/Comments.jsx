import { useContext, useState } from "react";
import "./Comments.scss";
import { AuthContext } from "../../Context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment"

const Comments = ({postID}) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);
  const { isLoading, error, data } = useQuery({ queryKey : ["Comments"], queryFn : () =>
    makeRequest.get("/Comments?postId=" + postID).then((res) => {
      return res.data;
    })}
  );
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newComment) => {
      return makeRequest.post("/Comments", newComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["Comments"]);
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postID });
    setDesc("");
  };
  // console.log(data);
  return (
    <div className="comments">
      <div className="write">
        <img src={`/upload/${currentUser.ProfilePic}`} alt="" />
        <input type="text" placeholder="write a comment" value={desc} onChange={(e) => setDesc(e.target.value)}/>
        <button onClick={handleClick}>Send</button>
      </div>
      {isLoading? "loading" : data.map((comment) => (
        <div className="comment">
          <img src={`/upload/${comment.ProfilePic}`} alt="" />
          <div className="info">
            <span>{comment._Name}</span>
            <p>{comment._Desc}</p>
          </div>
          <span className="date">{moment(comment.CreatedAt).fromNow()}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;