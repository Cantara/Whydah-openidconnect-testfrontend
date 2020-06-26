let jwt = require('jsonwebtoken');
const fetch = require("node-fetch");
const async  = require('express-async-await');
const config = require('./config.js');
let whydahSsoUrl = process.env.WHYDAH_ACCESS_URL || "https://whydahdev.cantara.no/oauth2";
let whydahSsoClientId = process.env.WHYDAH_ACCESS_CLIENT_ID_ENCODED || "client-id-missing";
let whydahSsoSecret = process.env.WHYDAH_ACCESS_CLIENT_SECRET || "client-secret-missing";
let redirectUrl = process.env.REDIRECT_URL || "http://localhost:3000/door/simulator";
//https://whydahsso-devtest.whydahos.io/oauth2/authorize?response_type=code&client_id=[YOUR_CLIENT_ID]&redirect_uri=[SOME_REDIRECT_URL]&scope=openid%20email%20phone&state=1234zyx
let checkToken = async (req, res, next) => {
    let accessToken = req.headers['x-access-token'] || req.headers['authorization'] || req.query.token; // Express headers are auto converted to lowercase
    let authCode = req.query.code;
    let authClientState = req.query.state;
    if (authCode) {
        //Fetch Token
        //const tokenUrl = "https://whydahsso-demo.whydahos.io/oauth2/token?grant_type=authorization_code&code=" + authCode;
        const tokenUrl = "https://whydahdev.cantara.no/oauth2/token?grant_type=authorization_code&code=" + authCode;
        let token = await postData(tokenUrl);
        console.log("tokenBody:", token);
        accessToken = token.access_token;
    }
    if (accessToken && accessToken.startsWith('Bearer ')) {
        // Remove Bearer from string
        accessToken = accessToken.slice(7, accessToken.length);
    }
    if (accessToken) {
        console.log("Token: ", accessToken);
        accessToken = accessToken.replace(/\"/g, '');
        // token = token.replace("%22", "");
        console.log("***" + accessToken);
        // let jwtSecret = process.env.JWT_SECRET || config.jwtSecret;
        jwt.verify(accessToken, whydahSsoSecret, (err, decoded) => {
            if (err) {
                console.log("err: ", err);
                return res.json({
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                req.decoded = decoded;
                console.log("Decoded: " + decoded);
                next();
            }
        });
    } else {
        console.log("Redirect. authcode:", authCode, ", token: ", accessToken);
        //authorize?response_type=code&client_id=rvMFAu67PX2s.eoWWuD0JTQGH7m03gXiKFjMlmNyAJE-&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&scope=openid%20email%20phone&state=1234zy"
        const authorizeUrl = whydahSsoUrl + "/authorize?response_type=code&scope=openid%20email&state=1234zy" +
            "&client_id=" + whydahSsoClientId +
            "&redirect_url=" + encodeURI(redirectUrl);
        console.log("Redirect. authcode:", authCode, ", token: ", accessToken, " authorizeUrl: ", authorizeUrl);
        return res.redirect(301, authorizeUrl);
    }
};

const postData = async url => {
    // Default options are marked with *
    let base64Credentials = Buffer.from(whydahSsoClientId + ':' + whydahSsoSecret).toString('base64');
    try {
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Authorization': 'Basic ' + base64Credentials,
                // 'Content-Type': 'application/json'
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer'
            // , // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            // body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        let jsonBody = "";
        try {
            jsonBody = await response.json(); // parses JSON response into native JavaScript objects
            console.log("JsonBody: ", jsonBody);
        } catch (responseError) {
            console.log("Response: ", response, " error: ", responseError);
        }
        return jsonBody;
    }catch (error) {
        console.log("Failed to fetch ", url, " reason: ", error, " credentials: ", base64Credentials);
    }
}

module.exports = {
    checkToken: checkToken
}