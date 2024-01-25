import bcrypt from 'bcryptjs'
import express from 'express'
import session from 'express-session'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import mongoose from 'mongoose'
// import { error } from 'console'

import User from './models/user.js'

const mongoDb = process.env.MONGODB_URI
mongoose.connect(mongoDb)

const app = express();
app.set("views", './views');
app.set("view engine", "pug");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ email: username }); // cannot query a virtual 'username: username'
      
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      };

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" })
      }

      return done(null, user);
    } catch(err) {
      return done(err);
    };
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  };
});

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.render("index", { title: 'Home' });
});

app.get("/log-in", (req, res) => res.render("log-in-form", { title: 'Log in' }));

app.get("/sign-up", (req, res) => res.render("sign-up-form", { title: 'Sign up' }));

app.post("/sign-up", async (req, res, next) => {
  try {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) throw err
      // otherwise, store hashedPassword in DB
      const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hashedPassword,
        // status: 'guest'
      });
      const result = await user.save();
      res.redirect("/");
    });
  } catch(err) {
    return next(err);
  };
});

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`))