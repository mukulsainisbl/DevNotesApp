require("dotenv").config();
const express = require("express");
const connection = require("./config/db");
const userRouter = require("./routes/user.route");
const app = express();
const cors = require("cors");
const noteRouter = require("./routes/note.route");
const authMiddleware = require("./middleware/auth.middleware");
app.use(express.json());

app.use(cors({
    origin: "*"
}));


app.use("/user", userRouter);
app.use("/note" , authMiddleware, noteRouter )

app.get('/' , (req,res) => {
  res.send("Server is running")
})

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("connected to database");
  } catch (error) {
    console.log("Error in Connecting to databas", error);
  }
  console.log(`Server is listen on ${process.env.PORT}`);
});
