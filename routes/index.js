var express = require('express');
const passport = require('passport');
const userModel = require("./users");
const postModel = require("./posts");
const localStrategy = require("passport-local");
const upload = require("./multer");
passport.use(new localStrategy(userModel.authenticate()));
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('feed');
});

router.get('/index', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login', { error: req.flash('error') });
});

router.post('/upload', isLoggedIn, upload.single("file"), async function(req, res, next) {
  if(!req.file){
    return res.status(404).send("no files were given");
  }
   const user = await userModel.findOne({username: req.session.passport.user});
   const post = await postModel.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    user: user._id
   });

   user.posts.push(post._id);
   await user.save();
   res.redirect("/profile");
});

router.get('/profile', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  .populate("posts")
  res.render("profile", {user});
});

router.post('/register', (req, res) => {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile");
    })
  })
});
// router.post('/register', function(req,res){
//   const userData = new userModel({
//     username: req.body.username,
//     email: req.body.email,
//     fullname: req.body.fullname
//   })
// })
router.post("/login", passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
}), function(req,res){
});

router.get('/logout', function(req, res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
}
module.exports = router;
