const express = require("express")
const{handleGenetateNewShorterURL,handleGetAnalytics} = require("../controllers/url")

const router = express.Router()

router.post("/", handleGenetateNewShorterURL)
router.get("/analytics/:shortId",handleGetAnalytics)
module.exports = router