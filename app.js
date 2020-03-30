const express = require(`express`)
const jwt = require(`jsonwebtoken`)
const fs = require(`fs`)

const PORT = 3010
const app = express()
const demopublicKey = fs.readFileSync(`public.pem`, `utf-8`)



app.use(express.json())

// Lets see some examples of use

app.get(`/api`, validateToken, (req, res) => {
    // we based on the middlewear know that this endpoint is protected
    payload = res.payload
    payload.addedValue = `some valuable data go in here!`
    res.json(payload)
})


function validateToken (req, res, next){
    // First we grab the token from the header
    const bearerTokenHead = req.headers['authorization']
    // We then check that the token exist, or return 403 
    if( typeof bearerTokenHead == `undefined`) res.sendStatus(403) // there is no token
    // Then we split the "bearer" and the JWT part
    const bearerToken = bearerTokenHead.split(` `)
    // We grab only the secon part, that is the JWT that we need
    const token = bearerToken[1]
    // Now we have the token and can verify it
    jwt.verify(token, demopublicKey, {algorithm : `RS256`}, (err, payload) => {
        //we now check that there is nothing wrong with the token
        if ( err ) res.sendStatus(401) // token is not valid
        // You should probably do other checks here based on the JWT, like audience and issuer
        // if (iss != `borhaug.io`) res.sendStatus(401) // token not issued by me
        // We now know that the request is valid. Lets return with the payload
        res.payload = payload
        next()
    })
}


app.listen(PORT, () => {
    console.log(`API is running and listening at port ${PORT}`)
})