import "./Home.scss";
import Stories from "../../Components/Stories/Stories"
import Posts from "../../Components/Posts/Posts"
import Share from "../../Components/Share/Share"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
let Home = () =>
{
    const navigate = useNavigate();
    useEffect(() => {
        if(!localStorage.getItem("user")){
            navigate("/Login");
        }
    })
    return (
        <div className="Home">
            <Stories/>
            <Share/>
            <Posts/>
        </div>
    );
}

export default Home;