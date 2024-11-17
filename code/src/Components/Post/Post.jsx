import "./Post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../Comments/Comments";
import { useContext, useState } from "react";
import moment from "moment"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../Context/authContext";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState("");
  const [comm, setcomm] = useState(0);

  const { currentUser } = useContext(AuthContext);
  const { isLoading, error, data } = useQuery({queryKey: ["Likes", post.PID], queryFn: () =>
    makeRequest.get("/Likes?postId=" + post.PID).then((res) => {
      return res.data;
    })
  }); 

  const {CommLoading, Commerror, Commdata} = useQuery({queryKey: ["Comments", post.PID], queryFn: () =>
  makeRequest.get("/Comments/comm?postId=" + post.PID).then((res) => {
    setcomm(res.data);
    return res.data;
  })});
  const queryClient = useQueryClient();
  
  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.UID));
  };

  const mutation = useMutation({
    mutationFn: (liked) => {
      if (liked) return makeRequest.delete("/Likes?postId=" + post.PID);
      return makeRequest.post("/Likes", { postId: post.PID });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["Likes"]);
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: (postId) => {
      return makeRequest.delete("/Posts/" + postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["Posts"]);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(post.PID);
    setTimeout(() => {if(window.confirm("Rollback?"))
    {
      console.log("ROLLBACK");
      revertMutation.mutate({PID :post.PID, UID: currentUser.UID});
    }
    else
    {
      return makeRequest.post("/Posts/Trunc/" + post.PID);
    }}, 1000);
  };

  const revertMutation = useMutation({
    mutationFn: (text) => {
      return makeRequest.post("/Posts/Revert/" + post.PID);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["Posts"]);
    },
  });

  const handleEdit = () =>
  {
    EditMutation.mutate(text);
  }

  const EditMutation = useMutation({
    mutationFn: (text) => {
      return makeRequest.post("/Posts/Update", {txt: text, UID: post.UID});
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["Posts"]);
    },
  });

  // const handleComment = () => 
  // {
  //   CommentMutation.mutate();
  // }

  // const CommentMutation = useMutation({
  //   mutationFn: (comm) => {
  //     return makeRequest.post("/Posts/Update", {txt: text, UID: post.UID});
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["Posts"]);
  //   },
  // });
  return (
    <div className="post">
      {edit && <div><input type="text" style={{border:"solid", borderWidth:"2px", borderColor: "grey",borderRadius:"20px", width:"99.5%", height:"70px", outline:"none"}} onChange={e => {setText(e.target.value);}}/><button style={{borderRadius:"20px"}} onClick={() => {setEdit(!edit); handleEdit();}}>Update</button></div>}
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={`/upload/${post.ProfilePic}`} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.UID}`}
                style={{ textDecoration: "none", color: "inherit" }}>
                <span className="name">{post._Name}</span>
              </Link>
              <span className="date">{moment(post.CreatedAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} style={{cursor:"pointer"}}/>
          {menuOpen && post.UID === currentUser.UID && <button onClick={handleDelete}>Delete ❌</button>}
          {menuOpen && (post.UID === currentUser.UID) &&<button style={{backgroundColor:"skyblue", top:"30px"}} onClick={() => {setEdit(!edit); setMenuOpen(!menuOpen)}}>Edit 🖋</button>}
        </div>
        <div className="content">
          <p>{post._Desc}</p>
          <img src={"./upload/"+post.IMG} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {data?.includes(currentUser.UID) ? <FavoriteOutlinedIcon style={{color:"red"}} onClick={handleLike}/> : <FavoriteBorderOutlinedIcon onClick={handleLike}/>}
            {data?.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {comm} Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postID = {post.PID}/>}
      </div>
    </div>
  );
};

export default Post;