var express = require('express');
var app = express();

var mysql = require('mysql');
var bodyparser = require('body-parser');
let url = require('url');
let querystring = require('querystring');



app.use(bodyparser.json({type:'application/json'}));
app.use(bodyparser.urlencoded({extended:true}));

// Change the password to your mySQL password in order to connect
var con = mysql.createConnection({
    host:   'tmkdmock-database.cmfqbnpelqfd.us-west-2.rds.amazonaws.com',
    user:   'admin',
    password:   'tZhUlulcgmxK6n5bInBC',
    database:   'tmkdmock'
});

var server = app.listen(3000, function(){
    var host = server.address().address
    var port = server.address().port
});

con.connect(function(error){
    if(error) console.log(error);
    else console.log('connected');
});

app.get('/user' , function(req, res) {
    con.query('select * from user where email = ?', req.query.email, function(error, rows, fields){
        if(error) console.log(error);

        else{
            res.send(rows)
        }
    })
})

app.get('/events', function(req, res){
    con.query('select * from event', function(error, rows, fields){
        if(error) console.log(error);

        else{
            res.send(rows);
        };
    });
});

app.get('/playlist', function(req, res) {
    con.query('select * from playlist where user_id = ?', req.query.user_id, function(error, rows, fields){
        if(error) console.log(error);

        else{
            res.send(rows)
        }
    })
})

app.get('/playlistContent', function(req, res) {
    con.query('select * from event e inner join playlist_content pc on e.event_id = pc.event_id where pc.playlist_id = ?', req.query.playlist_id, function(error, rows, fields){
        if(error) console.log(error);

        else{
            res.send(rows)
        }
    })
})

app.post('/newPlaylistEvent', function(req, res){
    let newEvent = {
        playlist_id: req.body.playlist_id,
        event_id: req.body.event_id
    }
    sql_query = "INSERT INTO playlist_content(playlist_id, event_id) VALUES (?,?)";

    let input_values = [
        newEvent.playlist_id,
        newEvent.event_id
    ]

    con.query(sql_query, input_values, function(error, results, fields) {
        if (error) console.log(error);
        return res.send({ error: false, data: results, message: "New event was added to playlist"})
    })
})


app.post('/newPlaylist', function (req, res) {
    let newPlaylist = {
        name: req.body.name,
        user_id: req.body.user_id,
        image: req.body.image,
        playlist_description: req.body.playlist_description,
        image_url: req.body.image_url,
        s3_key: req.body.s3_key
    }
    sql_query = "INSERT INTO playlist(name, user_id, image, playlist_description, image_url, s3_key) VALUES (?,?,?,?,?,?)";

    let input_values = [
        newPlaylist.name,
        newPlaylist.user_id,
        newPlaylist.image,
        newPlaylist.playlist_description,
        newPlaylist.image_url,
        newPlaylist.s3_key
    ]

    con.query(sql_query, input_values, function(error, results, fields) {
        if (error) console.log(error);
        return res.send({ error: false, data: results, message: "New playlist has been created successfully." })
    });
});

app.post('/newUser', function (req, res) {
    let newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        pass_hash: req.body.pass_hash,
        parent_type: req.body.parent_type,
        child_interests: req.body.child_interests,
        child_age_range: req.body.child_age_range,
        city: req.body.city
    }
    sql_query = "INSERT INTO user(first_name, last_name, email, pass_hash, parent_type, child_interests, child_age_range, city) VALUES (?,?,?,?,?,?,?,?)";

    let input_values = [
        newUser.first_name,
        newUser.last_name,
        newUser.email,
        newUser.pass_hash,
        newUser.parent_type,
        newUser.child_interests,
        newUser.child_age_range,
        newUser.city
    ]

    con.query(sql_query, input_values, function(error, results, fields) {
        if (error) console.log(error);
        return res.send({ error: false, data: results, message: 'New user has been created successfully.' })
    });
});