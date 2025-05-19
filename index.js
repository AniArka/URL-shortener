const express = require("express")
const path = require("path");
const URL = require('./models/url')
const urlRoute = require("./routes/url")
const { connectToMongoDB } = require("./connect")
const staticRoute = require('./routes/staticRouter')
const userRoute = require("./routes/user");
const cookieParser = require("cookie-parser");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");

const app = express()
const port = 8001

connectToMongoDB("mongodb://localhost:27017/short-url").then(()=>console.log("MongoDB connected"))

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use("/url",restrictToLoggedinUserOnly,urlRoute)
app.use("/user", userRoute);
app.use("/",staticRoute)

app.get('/:shortId', async(req,res) => {
    const shortId = req.params.shortId
    const entry = await URL.findOneAndUpdate({
        shortId
    },{$push: {
        visitHistory: {
            timestamp: Date.now()
        }
    }})
    res.redirect(entry.redirectURL)
})

app.listen(port, () => console.log(`server started at port:${port}`))