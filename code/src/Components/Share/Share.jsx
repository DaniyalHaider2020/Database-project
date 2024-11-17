import "./Share.scss";
import Image from "../../Pics/5.png";
import Map from "../../Pics/6.png";
import Friend from "../../Pics/1.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import EmojiPicker from 'emoji-picker-react';

const Share = () => {
    const [file, setFile] = useState(null);
    const [desc, setDesc] = useState("");
    const [emoji, setEmoji] = useState(false);

    const upload = async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await makeRequest.post("/upload", formData);
        return res.data;
      } catch (err) {
        console.log(err);
      }
    };

  const {currentUser} = useContext(AuthContext);

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      return await makeRequest.post("/Posts", newPost);
    },
      onSuccess: () => {
        queryClient.invalidateQueries(["Posts"]);
      },
  });

  const handleClick = async (e)=>
  {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();
    mutation.mutate({ desc, img: imgUrl });
    setDesc("");
    setFile(null);
  }
  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img
              src={`/upload/${currentUser.ProfilePic}`}
              alt=""
              />
            <input type="text" placeholder={`What's on your mind ${currentUser._Name}?`} onChange={(e) => setDesc(e.target.value)} value = {desc}/>
          </div>
          <div className="right">
            {file && <img className="file" alt="" src = {URL.createObjectURL(file)}/>}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input type="file" id="file" style={{display:"none"}} onChange={(e) => setFile(desc + e.target.files[0])}/>
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <span onClick = {() => setEmoji(!emoji)}>😀</span>
              {emoji && <EmojiPicker onEmojiClick={(e) => setDesc(desc+e.emoji)}/>}
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;