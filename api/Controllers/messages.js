import {db} from "../connect.js";
import moment from "moment";

export const getMessages = (req, res) => {
    const q = "SELECT msg\
                FROM Messages\
                WHERE _FROM = ? AND _TO = ?\
                UNION\
                SELECT msg\
                FROM Messages\
                WHERE _FROM = ? AND _TO = ?;"
    db.query(q, [req.query._FROM, req.query._TO, req.query._TO, req.query._FROM], (err, data) => {
        if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    })
}

export const addMessages = (req, res) => {
    const q = "INSERT INTO Messages(_FROM, _TO, msg, CreatedAt) VALUES(?,?,?,?);";
    console.log(req.body);
    db.query(q, [req.body._FROM, req.body._TO, req.body.msg, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")], (err, data) => {
    })
}