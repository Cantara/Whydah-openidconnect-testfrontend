let jwt = require('jsonwebtoken');

var jwksClient = require('jwks-rsa');

var client = jwksClient({
    jwksUri: "https://whydahdev.cantara.no/oauth2/.well-known/jwks.json"
});
function getKey(header, callback){

    client.getSigningKey(header.kid, function(err, key) {
        var signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}

exports.isValidWithSecret = (token, secret) => {
    let isValid = false;
    try {
        var decoded = jwt.verify(token, secret);
        isValid = true;
    } catch(err) {
        // err
        console.log("Failed to verify token: ", token , ". Reason: ", err);
    }
    return isValid;
}

exports.isValidWithJwks = (token, jwksUri) => {
    let isValid = false;
    const options = {
        algorithm: "RS256"
    }
    try {
        jwt.verify(token, getKey, options, function(err, decoded) {
            console.log(decoded.aud) // bar
        });
        isValid = true;
    } catch(err) {
        // err
        console.log("Failed to verify token: ", token , ". Reason: ", err);
    }
    return isValid;
}

exports.sum = (toAdd) => {

// Convert arguments object to an array
    var args = Array.prototype.slice.call(toAdd);

    // Throw error if arguments contain non-finite number values
    if (!args.every(Number.isFinite)) {
        throw new TypeError('sum() expects only numbers.')
    }

    // Return the sum of the arguments
    return args.reduce(function (a, b) {
        return a + b
    }, 0);
}