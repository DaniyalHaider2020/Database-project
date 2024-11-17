import { db } from "../connect.js"
import jwt from "jsonwebtoken";
import moment from "moment"

export const getPosts = (req, res) =>
{
    const userId = req.query.userId;
    const token = req.cookies.accessToken;

    if(!token) return res.status(401).json("Not logged in!");
    
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = userId !== "undefined" ? 
                    `SELECT p.*, u.UID AS UID, _Name, ProfilePic 
                    FROM Posts AS p 
                    JOIN Users AS u 
                    ON (u.UID = p.UID)
                    WHERE p.UID = ? 
                    ORDER BY p.CreatedAt DESC;`
                    : 
                    `SELECT p.*, u.UID AS UID, _Name, ProfilePic 
                    FROM Posts AS p 
                    JOIN Users AS u 
                    ON (u.UID = p.UID)
                    LEFT JOIN Relationships AS r 
                    ON (p.UID = r.FollowingID) 
                    WHERE r.FollowerID= ? 
                    OR p.UID =?
                    ORDER BY p.CreatedAt DESC;`;

        const values = 
        userId !== "undefined" ? [userId] :
         [userInfo.id, userInfo.id];
        db.query(q, values, (err, data)=>
        {
            if(err) return res.status(500).json(err)
            return res.status(200).json(data);
        })
    });
}

export const addPost = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const q =
        "INSERT INTO Posts(`_Desc`, `IMG`, `CreatedAt`, `UID`) VALUES (?)";
      const values = [
        req.body.desc,
        req.body.img,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        userInfo.id,
      ];
  
      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Post has been created.");
      });
    });
  };
  export const deletePost = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
      const qgetp = "SELECT * FROM Posts WHERE PID = ?;";
      const qinsp = "INSERT INTO PostsL VALUES (?,?,?,?,?);";

      const qgetl = "SELECT * FROM Likes WHERE PID = ?;";
      const qinsl = "INSERT INTO LikesL VALUES (?,?,?);";

      const qgetc = "SELECT * FROM Comments WHERE PID = ?;";
      const qinsc = "INSERT INTO CommentsL VALUES(?,?,?,?,?)";
      const qc = "DELETE FROM Comments WHERE PID = ?;"
      const ql = "DELETE FROM Likes WHERE PID = ?"
      const q =
        "DELETE FROM Posts \
        WHERE `PID`= ? AND `UID` = ?";

      db.query(qgetp, [req.params.id], (err, data) => {
        db.query(qinsp, [data[0].PID, data[0]._Desc, data[0].IMG, data[0].UID, data[0].CreatedAt], (err,data) => {})
      });
      db.query(qgetl, [req.params.id], (err, data) => {
        data.map(item => db.query(qinsl, [item.LID, item.UID, item.PID], (err,data) => {}))
      });
      db.query(qgetc, [req.params.id], (err, data) => {
        console.log(data);
        data.map(item => db.query(qinsc, [item.CID, item._Desc, item.CreatedAt, item.UID, item.PID], (err,data) => {}))
      });
        db.query(qc, [req.params.id], (err, data) => {
          db.query(ql, [req.params.id], (err, data) => {
            db.query(q, [req.params.id, userInfo.id], (err, data) => {
              if (err) return res.status(500).json(err);
              if(data.affectedRows>0) return res.status(200).json("Post has been deleted.");
              return res.status(403).json("You can delete only your post")
            });
          });
        });
    });
  };

  export const editPost = (req, res) =>
  {
    const q = "UPDATE Posts \
                SET _Desc=? \
                WHERE UID = ?";
    db.query(q, [req.body.txt, req.body.UID], (err, data) =>
    {
      if (err) return res.status(500).json(err);
        if(data.affectedRows>0) return res.status(200).json("Post has been updated.");
        return res.status(403).json("You can update only your post")
    })
  }

  export const revertPost = (req, res) =>
  {
    const qgetp = "SELECT * FROM PostsL WHERE PID = ?;";
    const qinsp = "INSERT INTO Posts VALUES (?,?,?,?,?);";

    const qgetl = "SELECT * FROM LikesL WHERE PID = ?;";
    const qinsl = "INSERT INTO Likes VALUES (?,?,?);";

    const qgetc = "SELECT * FROM CommentsL WHERE PID = ?;";
    const qinsc = "INSERT INTO Comments VALUES(?,?,?,?,?)";

    // console.log(Object.keys(req.params.id));
    db.query(qgetp, [req.params.id], (err, data) => {
      db.query(qinsp, [data[0].PID, data[0]._Desc, data[0].IMG, data[0].UID, data[0].CreatedAt], (err,data) => {})
    });
    db.query(qgetl, [req.params.id], (err, data) => {
      data.map(item => db.query(qinsl, [item.LID, item.UID, item.PID], (err,data) => {}))
    });
    db.query(qgetc, [req.params.id], (err, data) => {
      data.map(item => db.query(qinsc, [item.CID, item._Desc, item.CreatedAt, item.UID, item.PID], (err,data) => {}))
    });
    truncateLogs(req, res);
  }

  export const truncateLogs = (req, res) => 
  {
    // console.log(req.params);
    const trcp = "DELETE FROM PostsL WHERE PID = ?;";
    const trcl = "TRUNCATE TABLE LikesL";
    const trcc = "TRUNCATE TABLE CommentsL";

    db.query(trcp, [req?.params.id], (err, data) => {console.log(err)})
    db.query(trcl, [], (err, data) => {})
    db.query(trcc, [], (err, data) => {})
  }