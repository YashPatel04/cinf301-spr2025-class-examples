/*
 * Example of route middleware, see:
 * https://github.com/expressjs/express/blob/master/examples/route-middleware/index.js
 */
/**
 * Module dependencies.
 */

var express = require('express');

var app = express();

// Example requests:
//     curl http://localhost:3000/user/0
//     curl http://localhost:3000/user/0/edit
//     curl http://localhost:3000/user/1
//     curl http://localhost:3000/user/1/edit (unauthorized since this is not you)
//     curl -X DELETE http://localhost:3000/user/0 (unauthorized since you are not an admin)

// Dummy users
var users = [
  { id: 0, name: 'tj', email: 'tj@vision-media.ca', role: 'member' }
  , { id: 1, name: 'ciaran', email: 'ciaranj@gmail.com', role: 'member' }
  , { id: 2, name: 'aaron', email: 'aaron.heckmann+github@gmail.com', role: 'admin' }
];

function loadUser(req, res, next) {
  // Ensure :id is numeric
  if (isNaN(req.params.id)) {
    return next(new Error('Invalid user ID'));
  }

  // You would fetch your user from the db
  var user = users[req.params.id];
  console.log("In loadUser: " + (user ? user.name : 'unknown') + ", role = " + (user ? user.role : 'unknown'));
  if (user) {
    req.user = user;
    next();
  } else {
    next(new Error('Failed to load user ' + req.params.id));
  }
}

function andRestrictToSelf(req, res, next) {
  // If our authenticated user is the user we are viewing
  // then everything is fine :)
  console.log("In andRestrictToSelf: id = " + req.user.id + ", auth_id = " + req.authenticatedUser.id);
  if (req.authenticatedUser.id === req.user.id) {
    next();
  } else {
    // You may want to implement specific exceptions
    // such as UnauthorizedError or similar so that you
    // can handle these can be special-cased in an error handler
    // (view ./examples/pages for this)
    next(new Error('Unauthorized'));
  }
}

function andRestrictTo(role) {
  return function (req, res, next) {
    console.log("In andRestrictTo: role = " + role + ", auth_role = " + req.authenticatedUser.role);
    if (req.authenticatedUser.role === role) {
      next();
    } else {
      next(new Error('Unauthorized'));
    }
  }
}

// Middleware for faux authentication
// you would of course implement something real,
// but this illustrates how an authenticated user
// may interact with middleware

app.use(function (req, res, next) {
  req.authenticatedUser = users[0];
  next();
});

app.get('/', function (req, res) {
  res.redirect('/user/0');
});

app.get('/user/:id', loadUser, function (req, res) {
  console.log(req.user);
  res.send('Viewing user ' + req.user.name);
});

app.get('/user/:id/edit', loadUser, andRestrictToSelf, function (req, res) {
  res.send('Editing user ' + req.user.name);
});

app.delete('/user/:id', loadUser, andRestrictTo('admin'), function (req, res) {
  res.send('Deleted user ' + req.user.name);
});

// Global error handler for better error responses
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send({ error: err.message });
});

app.listen(3000, () => {
  console.log('Express started on port 3000')
});
