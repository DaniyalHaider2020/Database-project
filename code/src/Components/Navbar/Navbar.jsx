import "./Navbar.scss"
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/authContext";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import axios from "axios";


let Navbar = () =>
{
  const {currentUser} = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [err, setErr] = useState(null);
  const [searchval, setSearchval] = useState("");
  const [searching, setSearching] = useState(false);
  const [data, setData] = useState();
  let nav = useNavigate();
  const queryClient = useQueryClient();
  const [vallogout, setval] = useState(false);
    const handleLogout = async (e) => {
    try{
      await axios.post("http://localhost:8800/api/auth/logout", currentUser.UID);
      setval(true);
    }catch(error){
      console.log(error);
      setErr(error.response.data);
    }
  };
  const searchMutation = useMutation({
    mutationFn: async (search) => {
      return await makeRequest.get("/Search/?search="+search);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["Search"]);
    },
  });

  const handleSearch = () => {
    searchMutation.mutate(searchval);
  };
  useEffect(() => {
    if(vallogout) 
    {
      localStorage.removeItem("user");
      nav("/Login");
    }
  })
  let showsearch = async () =>
  {
    let x = await makeRequest.get("/Search/?search="+searchval);
    setData(x);
    // console.log(data.data.map((item) => item.Username));
    // return data.data.map(item => <Searchdrop data = {item.Username}/>);
    // return data.data.map(item => <div>{item.Username}</div>);
  }
    return (
        <div className="navbar">
          <div className="left">
            <Link to="/" style={{ textDecoration: "none" }}>
              <span>DAYTA</span>
            </Link>
            {/* <HomeOutlinedIcon /> */}
            {/* <GridViewOutlinedIcon /> */}
            <div className="search">
              <SearchOutlinedIcon/>
              <input type="text" placeholder="Search..." onClick={async () => {setSearching(!searching);}} onChange={async e => {console.log(searchval);setSearchval(e.target.value);if(searching)await showsearch()}}/>
            </div>
            {searching && <div className="searchbar"><ul className="listdata">{data?.data.map(item => <li><Link to={"/profile/"+item.UID}>{item.Username}</Link></li>)}</ul></div> }
          </div>  
          <div className="right">
            <PersonOutlinedIcon />
            <EmailOutlinedIcon />
            <NotificationsOutlinedIcon />
            <div className="user">
              <img
                src={`/upload/${currentUser.ProfilePic}`}
                alt=""
              />
              <span className = "uname" onClick={() => {setMenuOpen(!menuOpen)}}>
                  {currentUser._Name }
                  {menuOpen && <div className="DropDown"><div className="logout" onClick={handleLogout}>Logout</div></div>}
              </span>
            </div>
          </div>
        </div>
      );
}

export default Navbar;