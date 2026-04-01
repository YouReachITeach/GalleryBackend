function pictures(req, res) {
    'use strict';
    var username = req.params.username;
    var result = "hello the server \"does in fact work"
    res.status(200).json({
        nachricht: `Hallo, dein Highscore ist 1000!`
    }).end();
}

exports.pictures = pictures;