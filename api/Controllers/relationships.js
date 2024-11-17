import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationships = (req,res)=>{
    const q = "SELECT FollowerID FROM Relationships WHERE FollowingID = ?";
    db.query(q, [req.query.FollowedId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data.map(relationship=>relationship.FollowerID));
    });
}
export const getFollowing = (req,res)=>{
  const q = "SELECT FollowingID FROM Relationships WHERE FollowerID = ?";
  db.query(q, [req.query.FollowerId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map(relationship=>relationship.FollowingID));
  });
}
export const addRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO Relationships (`FollowerID`,`FollowingId`) VALUES (?)";
    const values = [
      userInfo.id,
      req.body.userId
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Following");
    });
  });
};

export const deleteRelationship = (req, res) => {

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM Relationships WHERE `FollowerID` = ? AND `FollowingID` = ?";
    db.query(q, [userInfo.id, req.query.userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Unfollow");
    });
  });
};

export const getMutual = (req, res) => {
  const q = "SELECT UID, Username\
              FROM Users\
              WHERE UID = ANY(SELECT R1.FollowingID \
                              FROM relationships AS R1 \
                              JOIN relationships as R2 \
                              ON R1.FollowingID = R2.FollowerID \
                              WHERE R1.FollowerID = ? \
                              AND R2.FollowingID = ?);"
  db.query(q, [req.params.id, req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
      return res.status(200).json(data);
  })
}