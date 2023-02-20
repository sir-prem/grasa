const express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 4000);

require('dotenv').config();

const { auth, requiresAuth } = require('express-openid-connect');

// auth0 config
const config = {
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    secret: process.env.SECRET,
};
app.use(auth(config));

// set view engine
app.set("view engine", "ejs");

// serve static files
app.use(express.static('views'));
app.use(express.static('scripts'));

// routes
app.get('/', requiresAuth(), (req, res) => {
    res.render("index.ejs", { email: req.oidc.user.email });
  });

app.get('/profile', requiresAuth(), (req, res) => {
    res.send(`<h1>Profile of: ${req.oidc.user.email}</h1>
                <img src=${req.oidc.user.picture} />`);
});

// database
var mongoose = require("mongoose");
var uri = "mongodb+srv://cluster0.7hvms.mongodb.net/test";

mongoose
	.connect( uri,
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

// socket IO
var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection);

var ShapesData = require('./models/ShapesData')
var userEmail;

function newConnection(socket) {
    console.log(`new connection: ${socket.id}`);

	socket.on('user email', (userEmailReceived) => {
		console.log(`userEmail is: ${userEmailReceived}`);
		userEmail = userEmailReceived;
	});

	socket.on('load request', async (msg) => {
		const filter = { userEmail: msg };
		var result = await ShapesData.findOne(filter).exec();

		if (result !== null) {
			var shapesLibraryFromDB = JSON.parse(result.JSONData);
	
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
			io.to(socket.id).emit(
					'load req recd', 
					{
						message:    `server: load request received from ${msg}. 
										Nothing in DB to load.`,
						result:     false
					}
				);
		}
	});

    socket.on('save request', async (msg) => {
        console.log(`save req: user email is: ${userEmail}`);
        
        const filter = { userEmail: userEmail };
        const update = { JSONData: msg };

        let shapesData = await ShapesData.findOneAndUpdate(
								filter,
								update, 
								{ 
									new:        true,
									upsert:     true 
								}
							);

        console.log('saved to DB');
    });
}
