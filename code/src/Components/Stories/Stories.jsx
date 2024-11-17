// import { useContext, useState } from "react";
// import { AuthContext } from "../../Context/authContext"

// const Stories = () => {

//   const {currentUser} = useContext(AuthContext)

//   //TEMPORARY
//   const stories = [
//     {
//       id: 1,
//       name: "John Doe",
//       img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
//     },
//     {
//       id: 2,
//       name: "John Doe",
//       img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
//     },
//     {
//       id: 3,
//       name: "John Doe",
//       img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
//     },
//     {
//       id: 4,
//       name: "John Doe",
//       img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
//     },
//   ];

//   return (
//     <div className="stories">
//       <div className="story">
//           <img src={currentUser.ProfilePic} alt="" />
//           <span>{currentUser._Name}</span>
//           <button>+</button>
//         </div>
//       {stories.map(story=>(
//         <div className="story" key={story.id}>
//           <img src={story.img} alt="" />
//           <span>{story.name}</span>
//         </div>
//       ))}
//     </div>
//   )
// }

// export default Stories


//--------------------------------------------------------------------

import React, { useContext, useState } from 'react';
import Stories from 'stories-react';
import 'stories-react/dist/index.css';
import { dataTagSymbol, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../Context/authContext"
import "./Stories.scss"

export default function ImagesStories() {
  const {currentUser} = useContext(AuthContext);
  const [story, setStory] = useState(null);
  const [seeStory, setsee] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (story) => {
      return makeRequest.put("/stories", story);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["stories"]);
    },
  });
  let validate = async () => {
  try{
      const formData = new FormData();
      formData.append("file", story);
      const x = await makeRequest.post("/upload", formData);
      return x.data;
    } catch (err) {
      console.log(err);
    }
  }
  let handleStory = async () => {
    let x = "";
    if(story) x = await validate();
    mutation.mutate({x, UID: currentUser.UID});
    setStory(null);
  }
  const { isLoading, error, data } = useQuery({ queryKey: ["stories"], queryFn:  () =>
  makeRequest.get("/Stories?userId="+currentUser.UID).then((res) => {
    return res.data;
  })});

  const {data: userData} = useQuery({ queryKey: ["users"], queryFn:  () =>
    data?.map(item => makeRequest.get("/users/find/"+item.UID).then((res) => {
        return res.data;
    }))
  })
 return (
  <div className="stories">
       <div className="story">
           <img src={"/upload/" + currentUser.ProfilePic} alt="" onClick={() => {setsee(true)}}/>
           <span>{currentUser._Name}</span>
           <label>
            <input style= {{display:"none"}} type="file" onChange={e => setStory(e.target.files[0])}/>+
           {story && <button onClick={handleStory}>✔</button>}
           </label>
        </div>
     {seeStory && <div onClick={() => {setsee(false)}}><Stories
        
       width="400px"
       stories= {data?.map((item) => {
        const obj = {};
        obj["type"] = "image";
        obj["duration"] = 3000;
        obj["url"] = "/upload/"+item.IMG;
        return obj;
       })}
       height="600px"/></div>}
  </div>
 );
}