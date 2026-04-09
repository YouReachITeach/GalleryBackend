'use strict';

var mysql = require('mysql2');
var bcrypt = require("bcrypt");
require('dotenv').config(); //loads environment variables from a .env file into process.env
const connectionData = {
    "host": process.env.DB_HOST,
    "port":process.env.DB_PORT,
    "user": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false //always trusting the server certificate
    }
}
async function registerUser(req, res) {
    const { username, password } = req.body || {};

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }
    var passwordHash = await bcrypt.hash(password, 10); //hash the password with a salt rounds of 10

    var con = mysql.createConnection(connectionData);

    //here I chose to use await instead of a callback function for readability
    try {
        await con.promise().query("INSERT INTO users (username, password) VALUES (?, ?)", [username, passwordHash]);
        res.status(200).json({ message: "User registered successfully" }).end();
    } catch (err) {
        console.log(err);
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: "Username already exists. Please choose another one." }).end();
        }
        else{
            res.status(500).json({
                errorType: "DATABASE_ERROR",
                message: "An internal server error occurred. Please try again later."
            });
        }
    }finally {
        con.end()
    }
}
async function getUserId(req, res) {
    var username = req.query.username;
    if(!username){
        res.status(400).json({ error: "Username is required" }).end();
        return;
    }
    var con = mysql.createConnection(connectionData);
    try {
        const [rows] = await con.promise().query("SELECT uid FROM users WHERE username = ?", [username]);
        if(!rows || rows.length === 0){
            res.status(404).json({ error: "User not found" }).end();
            return;
        }
        res.status(200).json({ uid: rows[0].uid }).end();
    }
    catch (error){
        console.log(error);
        res.status(500).json({
            errorType: "DATABASE_ERROR",
            message: "An internal server error occurred. Please try again later."
        }).end();
    }
    finally {
        con.end()
    }
}
function pictures(req, res) {
    var username = req.params.username;
    var result = "hello the server \"does in fact work"
    res.status(200).json({
        nachricht: `Hallo, dein Highscore ist 1000!`
    }).end();
}
exports.pictures = pictures;
exports.registerUser = registerUser;
exports.getUserId = getUserId;