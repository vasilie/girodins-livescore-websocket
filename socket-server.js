#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');
 
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(42069, function() {
    console.log((new Date()) + ' Server is listening on port 42069');
});
 
wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});
 
function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

const livescore = {
    matches: [
        {
            title: "Manchester United - Arsenal",
            minute: 0,
            home: {
                id: 1,
                img: 'https://cdn.zeplin.io/5e7c64631e4a7f91bac57e43/assets/D4A1C103-EF00-42AC-A03A-377236313B93.png',
                name: "Manchester United",
                score: 0
            },
            away: {
                id: 2,  
                img: 'https://cdn.zeplin.io/5e7c64631e4a7f91bac57e43/assets/B2D94B69-7F1C-4A67-A7BE-7E2BD6C1F6E8.png',
                name: "Arsenal",
                score: 0
            }
        },
        {
            title: "Chelsea - Newcastle",
            minute: 15,
            home: {
                id: 3,
                img :'https://cdn.zeplin.io/5e7c64631e4a7f91bac57e43/assets/8CE67CA7-B3A9-4B45-BC16-0C7F04BDB4DB.png',
                name: "Chelsea",
                score: 0
            },
            away: {
                id: 4,
                img: 'https://cdn.zeplin.io/5e7c64631e4a7f91bac57e43/assets/549D27D5-37B5-47E8-9E96-63717E4D27B0.png',
                name: "Newcastle",
                score: 0
            }
        },
        {
            title: "Liverpool - Southampton",
            minute: 42,
            home: {
                id: 5,
                img: "https://cdn.zeplin.io/5e7c64631e4a7f91bac57e43/assets/FF53FCB5-2E54-4351-BB8C-2822577E21AE.png",
                name: "Liverpool",
                score: 0
            },
            away: {
                id: 6,
                img: "https://cdn.zeplin.io/5e7c64631e4a7f91bac57e43/assets/1F080B13-5E0F-4CDB-A7CD-690CA8D0827F.png",
                name: "Southampton",
                score: 0
            }
        }
    ]
}

function isHome(){
    const isHome = Math.random() > 0.5 ? true : false;
    return isHome;
}
function hasScored(){
    const hasScored = Math.random() > 0.98 ? true : false;
    // console.log("GOAL!!!");
    return hasScored;
}

function changeScore(){
    livescore.matches.map(match=>{
        match.minute++;
        console.log('\''+match.minute);
        if (match.minute >= 90){
            match.minute = 0;
            match.home.score = 0;
            match.away.score = 0;
        }
        if (hasScored()){
            if (isHome()){
                match.home.score++;
                console.log("GOAL!", match.home.name);
                console.log("result", match.home.score);
            } else {
                match.away.score++;
                console.log("GOAL!", match.away.name);
                console.log("result", match.away.score);
            }
        } else {
            console.log("MISS!");
        }
    })
}
var interval = setInterval(function(){
    changeScore();
}, 10000);
var connection;

wsServer.on('request', function(request) {
    console.log("new request");
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    connection = request.accept('', request.origin);
    // console.log((new Date()) + ' Connection accepted.');
    var interval = setInterval(function(){
        connection.send(JSON.stringify(livescore));
    }, 10000);
    connection.send(JSON.stringify(livescore));
    // connection.sendUTF("hello"+count);
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
