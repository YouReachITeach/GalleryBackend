var http = require('http'),
    url = require('url'),
    express = require('express'),
    cors = require('cors'),
    dbdata = require('./api/db/db_connector');

const app = express();
const port = 3000;
app.use ( cors() );

app.get("/records/:username", dbdata.userRecords);
app.listen(port, function(){
    console.log("Server is listening on port " + port);
});