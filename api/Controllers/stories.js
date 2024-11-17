import { db } from "../connect.js";

export const addStory = (req, res) => 
{
    const q = `INSERT INTO Stories(IMG, UID) VALUES (?,?)`;
    db.query(q, [req.body.x, req.body.UID], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Story Inserted!");
        });
}

export const getStory = (req, res) => {
    const q = `SELECT s.* 
                FROM Stories AS s
                JOIN Relationships 
                ON UID = FollowingID 
                WHERE FollowerID = ? 
                OR UID = ?
                UNION
                SELECT *
                FROM Stories
                WHERE UID = ?;`;
    db.query(q, [req.query.userId, req.query.userId, req.query.userId], (err,data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    })
}