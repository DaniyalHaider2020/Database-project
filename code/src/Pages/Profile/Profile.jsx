import "./Profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../Components/Posts/Posts"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/authContext";
import Update from "../../Components/Update/Update";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [openPic, setOpenPic] = useState(false);

  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery({queryKey: ["users"], queryFn: () =>
    makeRequest.get("/users/find/" + userId).then((res) => {
      return res.data;
    })
  });

  const { isLoading: rIsLoading, data: relationshipData } = useQuery({
    queryKey : ["relationships"],
    queryFn: () =>
      makeRequest.get("/Relationships?FollowedId=" + userId).then((res) => {
        return res.data;
      })
  });
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (following) => {
      if (following)
      return makeRequest.delete("/relationships?userId=" + userId);
    return makeRequest.post("/relationships", { userId });
  },
  onSuccess: () => {
    queryClient.invalidateQueries(["relationships"]);
  },
});
const handleFollow = () => {
  mutation.mutate(relationshipData.includes(currentUser.UID));
};
return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
            <img src={"/upload/"+data.CoverPic} alt="" className="cover" />
            <img src={"/upload/"+data.ProfilePic} alt="" className="profilePic" onClick={() => {setOpenPic(!openPic)}}/>
          </div>
            {openPic && <div style={{position: "fixed", top: "11%", left: "30%", width: "10px", height: "10px", zIndex:"999"}} onClick={() => {setOpenPic(!openPic)}}>
              <img style = {{width: "600px", height:"600px"}} src = {"/upload/"+data.ProfilePic}/>
          </div>}
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <a href="http://facebook.com">
                  <FacebookTwoToneIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <InstagramIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <TwitterIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <LinkedInIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <PinterestIcon fontSize="large" />
                </a>
              </div>
              <div className="center">
                <span>{data._Name}</span>
                <div className="info">
                  <div className="item">
                    <LanguageIcon />
                    <span>{data.Website}</span>
                  </div>
                </div>
                {rIsLoading ? (
                  "loading"
                ) : userId === currentUser.UID ? (
                  <button onClick={() => setOpenUpdate(true)}>Update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipData.includes(currentUser.UID)
                      ? "Following"
                      : "Follow"}
                  </button>
                )}
              </div>
              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>
            <Posts userId={userId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;