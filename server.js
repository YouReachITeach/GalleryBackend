var http = require('http'),
    url = require('url'),
    express = require('express'),
    cors = require('cors'),
    dbdata = require('./api/db/dbdata.js');

const app = express();
const port = 3000;
app.use ( cors() );

app.get("/pictures", dbdata.pictures);
app.listen(port, function(){
    console.log("Server is listening on port " + port);
});