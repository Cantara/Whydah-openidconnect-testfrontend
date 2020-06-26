var jwtHelper = require("../jwthelper");
var expect = require('chai').expect;

describe('#sum()', function() {
    context('without arguments', function() {
        it('should return 0', function() {
            expect(jwtHelper.sum(1,2)).to.equal(0)
        })
    })
});

describe('#isValidWithJwks()', function() {
    const tokenFromFetch = "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1c2VyYWRtaW4iLCJhdWQiOiJydk1GQXU2N1BYMnMuZW9XV3VEMEpUUUdIN20wM2dYaUtGak1sbU55QUpFLSIsInNjb3BlIjoiIiwiaXNzIjoiaHR0cHM6Ly93aHlkYWhkZXYuY2FudGFyYS5uby9vYXV0aDIiLCJ1c2VydG9rZW5faWQiOiIyN2Q4YjM5NC02NjNiLTQ2ZjgtYmRhOS1kN2M2ZTg2ODdlMGUiLCJleHAiOjE1OTMxNzM0NzMsImFwcF9pZCI6ImIyMmJlOTFjMWIzZTdhYjViNmMwZmIwMzgiLCJpYXQiOjE1OTMxNzMzODZ9.B5o-h--3Vkn-34Nhcs5YOcqDoppTWhxPZdmkL6mVXwEWJzH0f7wmAtJBNBcKbai_vE2ZKct3hs-ofWklvOCcj4yoHhezx2BjK9Ot-a8kP0diKzl1nnh_UBwxomoFrv7DeThmSKMMve5zlLfwOr9KgzaJrkinbV8jVIRkbMx5V7bDhwewg_YFLrZ7TzhXretI7Qe8GGt2k8xyRDJblxh9rIGX80ojnkq3qTs58zBZQl-KZoYrVTVQc9d2Y07TYvFPR_CUvc5KCm_c-GgUuapw3PLzais_c3Ak1f7MSrEMVlyZmvLJbi2ytx6UuXJsRqwQt9V6Vll8qJMEKz9AsQs7bA";
    const jwksUri = "https://whydahdev.cantara.no/oauth2/.well-known/jwks.json";
    context('valid arguments', function() {
        it('should return true', function() {
            expect(jwtHelper.isValidWithJwks(tokenFromFetch, jwksUri)).to.equal(true)
        })
    })
});