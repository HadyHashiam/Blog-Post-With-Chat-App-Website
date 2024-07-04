require('dotenv').config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const SessionStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const socketIO = require("socket.io");
const bodyParser = require('body-parser'); // Add body-parser
const connectDB = require('./controllers/database');
const DB_URL = process.env.MONGODB_URI


const postRouter = require("./routes/post.route");
const authRouter = require("./routes/auth.route");
const profileRouter = require("./routes/profile.route");
const profileRouter2 = require("./routes/profile.route2");
const friendRouter = require("./routes/friend.route");
const homeRouter = require("./routes/home.route");
const chatRouter = require("./routes/chat.route");
const groupRouter = require("./routes/group.route");
const { getFriendRequests } = require("./models/user.model");

const app = express();
const server = require("http").createServer(app);
const io = socketIO(server);

// Socket.io setup
io.onlineUsers = {};
require("./sockets/friend.socket")(io);
require("./sockets/init.socket")(io);
require("./sockets/chat.socket")(io);
require("./sockets/group.socket")(io);

// Static files and middleware
app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "images")));
app.use(flash());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB connection
connectDB();

// MongoDB session store
const STORE = new SessionStore({
    uri: DB_URL,
    collection: "sessions"
});

// Express session setup
app.use(
    session({
        secret: "this is my secret secret to hash express sessions ......",
        resave: false,
        saveUninitialized: false,
        store: STORE
    })
);

// View engine setup
app.set("view engine", "ejs");
app.set("views", "views");

// Middleware to handle friend requests
app.use((req, res, next) => {
    let userId = req.session.userId;
    if (userId) {
        getFriendRequests(userId)
            .then(requests => {
                req.friendRequests = requests;
                next();
            })
            .catch(err => res.redirect("/error"));
    } else {
        next();
    }
});

// Routes
app.use("/post", postRouter);
app.use("/", authRouter);
app.use("/", homeRouter);
app.use("/profile", profileRouter);
app.use("/profile2", profileRouter2);
app.use("/friend", friendRouter);
app.use("/chat", chatRouter);
app.use("/groups", groupRouter);

// Error handling
app.get("/error", (req, res) => {
    res.status(500);
    res.render("error.ejs", {
        isUser: req.session.userId,
        pageTitle: "Error",
        friendRequests: req.friendRequests
    });
});

// 404 Not Found handling
app.use((req, res) => {
    res.status(404);
    res.render("not-found", {
        isUser: req.session.userId,
        pageTitle: "Page Not Found",
        friendRequests: req.friendRequests
    });
});

// Server listening
const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log("Server listening on port " + port);
});
