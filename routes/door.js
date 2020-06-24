const express = require("express");
const config = require("../config");

const router = express.Router();

// Home page
router.get("/open", (req, res) => {
    const userToken = req.decoded;
    const userName = userToken.name || "-unparsable-";
    console.log("userToken: ", userToken);
    res.render("door");
});

router.get("/simulator", (req, res) => {
    const userToken = req.decoded;
    const userName = userToken.name || "-unparsable-";
    //azureService.openDoor(config.targetDevice, "mee");
    console.log("simulator using userToken: ", userToken);
    //accessLogDao.doorOpened(userToken);
    res.render("door-simulator");
});


module.exports = router;