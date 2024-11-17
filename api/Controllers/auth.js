import { db } from "../connect.js";
import  jwt from "jsonwebtoken";

export const register = (req,res) =>
{
    const q = "SELECT * FROM Users\
                WHERE Username = ?";

    db.query(q, [req.body.username], (err,data) =>{
        if(err) return res.status(500).json(err);
        if(data.length) return res.status(409).json("User Already exists!");

    const qin = "INSERT INTO Users (`Username`,`Email`,`Pass`,`_Name`) VALUES(?)";
    db.query(qin, [[req.body.username, req.body.email, req.body.password, req.body.name]], (err, data) => {
      console.log(err);
        if (err) return res.status(500).json(err);
        return res.status(200).json("User has been created.");
      });
    });
}

export const login = (req,res) =>
{
    const q = "SELECT * FROM users WHERE username = ?";
    // return res.status(400).json(req.body.password);

    db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");
    if (req.body.password != data[0].Pass)
      return res.status(400).json("Wrong password or username!");

    const token = jwt.sign({ id: data[0].UID }, "secretkey");

    const { password, ...others } = data[0];

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
}

export const logout = (req,res) =>
{
  res.clearCookie("accessToken",{
    secure:true,
    sameSite:"none"
  }).status(200).json("User has been logged out.");
}



/*
  LOGS
  Typing Status
  Chat Status
  Friend List+++++++++++++++++++++
*/

/*
  LOGS
  STORY
  NOTIF
  MSGS
  */