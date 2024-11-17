import express from "express";
const app = express();
import userRoutes from "./Routes/users.js"
import storiesRoutes from "./Routes/stories.js"
import relationshipsRoutes from "./Routes/relationships.js"
import postsRoutes from "./Routes/posts.js"
import likesRoutes from "./Routes/likes.js"
import commentRoutes from "./Routes/comment.js"
import authRoutes from "./Routes/auth.js"
import searchRoutes from "./Routes/search.js"
import MessagesRoutes from "./Routes/messages.js"
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

app.use((req,res,next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
})
app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000"
}))
app.use(cookieParser())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../code/public/upload");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/api/users", userRoutes)
app.use("/api/stories", storiesRoutes)
app.use("/api/relationships", relationshipsRoutes)
app.use("/api/posts", postsRoutes)
app.use("/api/likes", likesRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/search", searchRoutes)
app.use("/api/Messages", MessagesRoutes)

app.listen(8800, () => {
    console.log("Connection Succesful!");
})