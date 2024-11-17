import { db } from "../connect.js"
import jwt from "jsonwebtoken"
import moment from "moment"

export const getComments = (req, res) =>
{
    const q = `SELECT c.*, u.UID AS UID, _Name, ProfilePic 
                FROM Comments AS c 
                JOIN users AS u 
                ON (u.UID = c.UID)
                WHERE c.PID = ? 
                ORDER BY c.CreatedAt DESC;`;
  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
}

export const addComments = (req,res) =>
{
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO Comments(`_Desc`, `CreatedAt`, `UID`, `PID`) VALUES (?)";
    const values = [
      req.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.postID
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Comment has been created.");
    });
  });
}

export const getComval = (req, res) => 
{
  const q = "SELECT * FROM Comments\
              WHERE PID = ?;";
  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.length);
  });
}