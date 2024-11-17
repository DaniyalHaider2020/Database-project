import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const userId = req.params.userID;
  const q = "SELECT * FROM Users WHERE UID=?";

  db.query(q, [userId], (err, data) => {
    // console.log(data);
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");
  
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "UPDATE Users SET `_Name`=?, `Email`=?,`ProfilePic`=?,`CoverPic`=?, `Pass`=? WHERE UID=?;";
      db.query(
      q,
      [
        req.body.name,
        req.body.email,
        req.body.ProfilePic,
        req.body.CoverPic,
        req.body.password,
        userInfo.id,
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!");
        return res.status(403).json("You can update only your post!");
      }
    );
  });
};