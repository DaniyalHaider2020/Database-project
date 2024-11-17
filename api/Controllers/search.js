import { db } from "../connect.js";

export const getSearch = (req, res) => 
{
    const q = `SELECT * FROM Users WHERE Username LIKE CONCAT(?,'%');`;
    db.query(q, [req.query.search], (err, data) => {
        // console.log(data);
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
        });
}