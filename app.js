const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const loda = require("lodash");
const mongoose = require("mongoose");

// mongoose.connect(
//   "mongodb://localhost:27017/blogDB", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }
// );

mongoose.connect(
  "mongodb+srv://xerycks:12345678qwe@cluster0-cnzva.mongodb.net/blogDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);


const app = express();

const postSchema = new mongoose.Schema({
  blogTitle: String,
  blogContent: String,
});

const Post = mongoose.model("Post", postSchema);

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

app.get("/", (req, res) => {
  Post.find({}, function (err, result) {
    if (!err) {
      if (result) {
        res.render("home", {
          posts: result,
        });
      }
    }
  });
});

app.get("/contact", (req, res) =>
  res.render("contact", {
    contactContent: "Nothing Yet",
  })
);

app.get("/secret", function (req, res) {
  res.redirect('/#secret');
});

app.post("/compose", function (req, res) {
  const post = new Post({
    blogTitle: req.body.title,
    blogContent: req.body.content,
  });

  post.save("", function (err) {
    if (!err) {
      res.redirect("/");
    } else {
      res.send("ERROR 69");
    }
  });
});

app.get("/post", function (req, res) {
  res.render("post");
});

app.get("/posts/:postTitle", function (req, res) {
  Post.findOne({
      blogTitle: req.params.postTitle,
    },
    function (err, result) {
      if (!err) {
        if (result) {
          res.render("post", {
            heading: result.blogTitle,
            para: result.blogContent,
          });
        }
      }
    }
  );
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});