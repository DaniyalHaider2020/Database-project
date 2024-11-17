import "./LeftSide.scss"
import Friends from "../../Pics/1.png";
// import Groups from "../../Pics/2.png";
// import Events from "../../Pics/3.png";
import Messages from "../../Pics/4.png";
import { AuthContext } from "../../Context/authContext";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { makeRequest } from "../../axios";
import { useQuery } from "@tanstack/react-query";
import vid from "../../Pics/VID.mp4";
let LeftSide = () =>
{
  const [userData, setUserData] = useState([]);
  const [xmsg, setxmsg] = useState([]);
  const {currentUser} = useContext(AuthContext);
  const [dropFollowing, setFollowing] = useState(false);
  const [dropMessages, setMessages] = useState(false);
  const [opnMsg, setmsg] = useState(false);
  const [getuser, setuser] = useState("");
  const [msgs, smsgs] = useState("");
  const [getuid, setuid] = useState(1);
  
  let handlemsgs = async () => {
    return await makeRequest.post("/Messages", {_FROM: currentUser.UID, _TO:getuid, msg: msgs});
  }
  const {msgdata} = useQuery({queryKey : ["Messages"],
  queryFn: async () =>{
  await makeRequest.get("/Messages", {params:{_FROM: currentUser.UID , _TO: getuid}}).then(async (res) => {
      setxmsg(res.data.map(item => item));
      return res.data;
    })}});
  const { isLoading, data } = useQuery({
    queryKey : ["relationships"],
    queryFn: async () =>
    await makeRequest.get("/Relationships/following?FollowerId=" + currentUser.UID).then(async (res) => {
        return Promise.all(await res.data.map(async (item) => {return makeRequest.get("/Users/find/"+item).then((res) => {return res.data;})})).then((values) => {return values;});
      })
  });
  const {rdata} = useQuery({
    queryKey : ["Relationships"],
    queryFn : async () => await makeRequest.get("/Relationships/mutual/"+currentUser.UID).then((res) => {
      setUserData(res.data.map(item => item));  
      return res.data;
    })
  });
    return (
        <div className="leftBar">
          <div className="container">
            <div className="menu">
              <div className="user">
                <img
                  src={`/upload/${currentUser.ProfilePic}`}
                  alt=""
                />
                <span>
                  <Link to={"/profile/"+currentUser.UID} style={{textDecoration: "none"}}>
                    {currentUser._Name }
                  </Link>
                </span>
              </div>
              <div className="item" >
                <img src={Friends} alt="" />
                <span style = {{cursor:"pointer"}} onClick={() => {setFollowing(!dropFollowing)}}>Following</span>
              </div>
              {dropFollowing && <div style={{display:"flex", flexDirection:"column"}}>{data?.map(item => <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}><img style = {{width: "40px", height:"40px", borderRadius:"50%"}} src = {`/upload/${item.ProfilePic}`}/><Link to={"/Profile/" + item.UID}>{item.Username}</Link></div>)}</div>}
              {/* <div className="item">
                <img src={Groups} alt="" />
                <span>Groups</span>
              </div> */}
            </div>
            <hr />
            {/* <video src={vid} width="320" height="240" autoPlay="true" controls="controls"></video> */}
            <div className="menu">
              <span>Your shortcuts</span>
              {/* <div className="item">
                <img src={Events} alt="" />
                <span>Events</span>
              </div> */}
              <div className="item">
                <img src={Messages} alt="" />
                <span style = {{cursor:"pointer"}} onClick={() => {setMessages(!dropMessages)}}>Messages</span>
              </div>
              {dropMessages && <div>{userData? userData.map(item => <div onClick={() => {setmsg(true); setuser(item.Username); setuid(item.UID)}}>{item.Username}</div>) : "loading"}</div>}
              {opnMsg && <div style={{position: "fixed", top: "11%", left: "30%", width: "600px", height: "600px", zIndex:"1000", backgroundColor:"grey", borderRadius:"50px"}} >
                          <p style ={{alignItems: "center"}}>
                            {getuser}
                          </p>
                          <div style={{display:"flex", justifyContent:"center"}}>
                            <input style = {{borderRadius:"50px", width:"500px", outline:"none"}} type="text" placeholder="Enter msg..." onChange={e => smsgs(e.target.value)}/> 
                            <button onClick={handlemsgs}>Send</button>
                            {xmsg?.map(item => <div>{item.msg}</div>)}
                          </div>
                        </div>
                        }
            </div>
          </div>
        </div>
      );
}

export default LeftSide;