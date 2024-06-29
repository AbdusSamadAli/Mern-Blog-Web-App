const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5003;
const UserModel = require("./models/UserModel");
const PostModel = require("./models/PostModel");

app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:5174"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());

mongoose
  .connect("process.env.MONGODB_URI", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error: ", err));

app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      UserModel.create({ username, email, password: hash })
        .then((user) => res.json(user))
        .catch((err) => res.json(err));
    })
    .catch((err) => console.log(err));
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email: email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, response) => {
        if (response) {
          const token = jwt.sign(
            { email: user.email, username: user.username },
            "jwt-secret-key",
            { expiresIn: "1d" }
          );
          res.cookie("token", token);
          return res.json("Success");
        } else {
          return res.json("Password is incorrect");
        }
      });
    } else {
      return res.json("User not exist");
    }
  });
});

app.post("/create", (req, res) => {
    const { title, description, email } = req.body;
  
    console.log("Request received:");
    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Email:", email);
  
    if (!title || !description || !email) {
      return res.status(400).json("Missing required fields");
    }
  
    PostModel.create({
      title,
      description,
      email, 
    })
      .then((result) => {
        console.log("Post created:", result);
        res.json("Success");
      })
      .catch((err) => {
        console.error("Error creating post:", err);
        res.status(400).json(err);
      });
  });
  
  

app.get('/getposts', (req, res)=>{
    PostModel.find()
    .then(posts => res.json(posts))
    .catch(err => res.json(err))
})
app.get('/getpostbyid/:id', (req, res) => {
    const id = req.params.id
    PostModel.findById({_id: id})
    .then(post => res.json(post))
    .catch(err => console.log(err))
})

app.put('/editpost/:id', (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json("Missing required fields");
    }

    PostModel.findByIdAndUpdate(
        { _id: id },
        { title, description },
        { new: true } 
    )
    .then(result => {
        if (!result) {
            return res.status(404).json("Post not found");
        }
        res.json("Success");
    })
    .catch(err => {
        console.error("Error updating post:", err);
        res.status(500).json(err);
    });
});

app.delete('/deletepost/:id', (req, res) => {
    const { id } = req.params;

    PostModel.findByIdAndDelete({ _id: id })
    .then(result => {
        if (!result) {
            return res.status(404).json("Post not found");
        }
        res.json("Success");
    })
    .catch(err => {
        console.error("Error deleting post:", err);
        res.status(500).json(err);
    });
});
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json("Success");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

