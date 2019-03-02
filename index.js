const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const app = express()
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

// --- SNAKE LOGIC GOES BELOW THIS LINE ---

// Handle POST request to '/start'
app.post('/start', (request, response) => {
  // NOTE: Do something here to start the game

  // Response data
  const data = {
    color: '#FF0080',
  }

  return response.json(data)
})

// Handle POST request to '/move'
app.post('/move', (request, response) => {
  // NOTE: Do something here to generate your move
  console.error("in move")
  const c = request.body;
  const board = c.board;
  const snakes = c.snakes;
  const yourBody = c.you.body;
  const yourHead = c.you.body[0];

  const boardLength = board.height;
  const boardWidth = board.width;

  console.error(boardLength);
  console.error(boardWidth);
  console.log(yourHead);
  console.log(yourHead.x);
  console.log(yourHead.y);
  myNeighbours = neighbours(yourHead);
  console.error(myNeighbours);

  // if (yourBody[0].x <= 0 || yourBody[0].y <= 0) {
    
  // }

  function neighbours (yourHead)  {
    var neighbours = Array();
    if (yourHead.x > 0)  {
      neighbours.push([yourHead.x-1, yourHead.y]);
    }
    if (yourHead.x < boardWidth)  {
      neighbours.push([yourHead.x+1, yourHead.y]);
    }
    if (yourHead.y > 0)  {
      neighbours.push([yourHead.x, yourHead.y-1]);
    }
    if (yourHead.x < boardWidth)  {
      neighbours.push([yourHead.x, yourHead.y+1]);
      console.error("if4");
      // REQUIRED - DO NOT TOUCH CONSOLE
    }

    neighbours.forEach(function (neighbour)   {

      if (yourBody[1].x== neighbour[0] && yourBody[1].y == neighbour[1]) {
        neighbours.pop(neighbour);
        console.error("removing body from neighbours")
      }
    });
    

    return neighbours;
  }

  function direction (fromCell, neighbour)  {
    dx = neighbour[0] - fromCell.x;
    dy = neighbour[1] - fromCell.y;

    if (dx == 1)  {
      return 'right';
    }
    if (dx == -1) {
      return 'left';
    }
    if (dy == 1)  {
      return 'down';
    }
    if (dy == -1) {
      return 'up';
    }

  }

  // Response data
  var number = Math.random() * (neighbours(yourHead)) + 0;
  var thisDirection = direction(yourHead, myNeighbours[number])
  console.error("this direction");
  console.error(thisDirection)
  const data = {
    move: thisDirection, // one of: ['up','down','left','right']
  }

  return response.json(data)
})

app.post('/end', (request, response) => {
  // NOTE: Any cleanup when a game is complete.
  return response.json({})
})

app.post('/ping', (request, response) => {
  // Used for checking if this snake is still alive.
  return response.json({});
})

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
