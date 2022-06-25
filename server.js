const express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 4000);

require('dotenv').config();

const { auth, requiresAuth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  secret: process.env.SECRET,
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.set("view engine", "ejs");

// serve static files
app.use(express.static('views'));
app.use(express.static('scripts'));

//==============================================================================
// 
//      routes
//      
//------------------------------------------------------------------------------

// req.isAuthenticated is provided from the auth router
app.get('/', requiresAuth(), (req, res) => {
    //res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
    res.render("index.ejs", { email: req.oidc.user.email });
  });


app.get('/profile', requiresAuth(), (req, res) => {
    //res.send(JSON.stringify(req.oidc.user));
    res.send(`<h1>Profile of: ${req.oidc.user.email}</h1>
                <img src=${req.oidc.user.picture} />`);
});


//==========================================================================
// 
//      Database
//      
//--------------------------------------------------------------------------

var mongoose = require("mongoose");
var flash = require("connect-flash");

// path to mongo database
var uri = "mongodb+srv://cluster0.7hvms.mongodb.net/test";

// connect to DB
mongoose
.connect(
    uri,
    {
        dbName: 'grasaDB',
        user: 'admin',
        pass: '00000',
        useNewUrlParser: true,
        useUnifiedTopology: true
    }   
  )
  .then(
      () => {
          console.log('MongoDB connected...');
      }
  )


 
//================================================================
//
//      middleware stack
//
//----------------------------------------------------------------

 /*
// connect-flash messages middleware
app.use(flash());

// json and url parser middlewares
//app.use(express.json({limit: '50mb'}));
//app.use(express.urlencoded({ limit: "200mb",  extended: true, parameterLimit: 1000000 }));

*/


//================================================================
//
//      Socket IO stuff
//
//----------------------------------------------------------------

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

var ShapesData = require('./models/ShapesData')
var userEmail;
var clients = [];
var client;



function newConnection(socket) {
    console.log(`new connection: ${socket.id}`);

    socket.on('user email', (msg) => {
        userEmail = msg;
        client = {
            socketID: socket.id,
            email: msg
        };
        clients.push(client);
        console.log(`clients[] length is: ${clients.length}`);
        console.log(`userEmail is: ${userEmail}`);
    });





    socket.on('load request', async (msg) => {

        const filter = { userEmail: msg };

        var result = await ShapesData.findOne(filter).exec();

        console.log(`on load request, result is: ${result}`);

        if (result !== null) {

            var shapesLibraryFromDB = JSON.parse(result.JSONData);
    
            console.log(`load result: ${shapesLibraryFromDB}`);
            console.log(`... shapesArray length is: ${shapesLibraryFromDB.shapesArray.length}`);
    
            io.to(socket.id).emit(
                            'load req recd', 
                            {
                                shapesLibraryFromDB: shapesLibraryFromDB,
                                message: `server: load request received from ${msg}`,
                                result: true
                            }
                        );

        }
        else {
            console.log(`reaching else clause ?`);
            io.to(socket.id).emit(
                'load req recd', 
                {
                    message: `server: load request received from ${msg}. Nothing in DB to load.`,
                    result: false
                }
            );
        }


    });

    



    socket.on('save request', async (msg) => {

        
        const filter = { userEmail: userEmail };
        const update = { JSONData: msg };
        console.log(filter);

        let shapesData = await ShapesData.findOneAndUpdate(
                                            filter,
                                            update, 
                                            { new: true,
                                              upsert: true }
                                        );

        /*
        var shapesData = new ShapesData({ 
                userEmail: userEmail, 
                JSONData: msg 
            });

        shapesData.save();
        */
        console.log(shapesData);
        console.log('saved to DB');
    });

    
}
