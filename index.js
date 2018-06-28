const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const Todo = require('./db').Todo;
const User = require('./db').User;

// cookie-parser lets us access cookies in the browser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// And now, set up sessions so we can track a logged-in user
const session = require('express-session');
app.use(session({
  key: 'user_sid',
  secret: 'ldfhgosdhgoushdfglahdflajsd',
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 600000
  }
}));


const expressHbs = require('express-handlebars');

app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

const static = express.static;
app.use(static('public'));

// This is middleware that will clear the cookie for stale user sessions
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid');
  }
  next();
});

// helper middleware function to check for logged-in users
var ensureLoggedIn = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    next();
  } else {
    res.redirect('/login');
  }
};


app.get('/', ensureLoggedIn, (req, res) => {
  Todo.getAll(req.session.user)
    .then((data) => {
      console.log(data);
      // res.send(data);
      res.render('homepage', {
        todos: data
      });
     })
    .catch((error) => { console.log(error); });
});

app.get('/login', (req, res) => {
  res.render('login-page');
});

app.post('/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  User.authenticateUser(username, password)
    .then(isValid => {
      if (isValid) {
        User.getUser(username)
          .then(u => {
            req.session.user = u.id;
            console.log(`Your user id is ${u.id}`);
            res.redirect('/');
          })
      } else {
        console.log('your credentials no good!');
        res.redirect('/login');
      }
    })
  // res.send('yeah, you logged in');
});

app.get('/signup', (req, res) => {
  res.render('signup-page');
});

app.post('/signup', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let password2 = req.body.password2;

  // console.log(username);
  // console.log(password);
  // console.log(password2);
  User.getUser(username)
    .then(user => {
      if (user) {
        console.log('found that user');
        res.send('that punk already exists');
      } else if (password === password2) {
        User.createUser(username, password)
          .then(u => {
            req.session.user = u.id;
            console.log(`Your user id is ${u.id}`);
            res.redirect('/');
            // res.send(`Your user id is ${u.id}`);
          })
          .catch(err => {
            res.send(err);
          })
      } else {
        res.send('no matchy your passwordy');
      }
    })



  // res.send('yeah, you signed up');
});


app.get('/new', (req, res) => {
  console.log('This is the /new route');
  res.render('todo-create-page');
});

app.post('/new', (req, res) => {
  console.log(req.body);
  // res.send('hey you submitted the form');

  Todo.add(req.session.user, req.body.title)
    .then((data) => {
      // console.log(data);
      // res.send(data);
      res.redirect(`/${data.id}`);
    })

});


app.get('/:id/edit', (req, res) => {
  // show the form, but populate with
  // the current todo
  Todo.getOne(req.session.user, req.params.id)
    .then((data) => {
      console.log(data);
      // res.send(data);
      res.render('todo-edit-page', data);
    })
});

app.post('/:id/toggle', (req, res) => {
  let isDone = false;
  if (req.body.finished) {
    isDone = true;
  }
  Todo.setFinished(req.session.user, req.params.id, isDone)
  .then((data) => {
    res.redirect(`/`);
  })

});

app.post('/:id/edit', (req, res) => {
  let newTitle = req.body.title;
  let isDone = false;
  if (req.body.finished) {
    isDone = true;
  }

  Todo.setTitle(req.session.user, req.params.id, newTitle)
    .then((data) => {

      Todo.setFinished(req.session.user, req.params.id, isDone)
        .then((data) => {
          // res.redirect(`/${req.params.id}/edit`);
          res.redirect(`/`);
        })
    });
});

app.get('/:id', (req, res) => {
  console.log('This is the /:id route');
  Todo.getOne(req.session.user, req.params.id)
    .then((data) => {
      console.log(data);
      // res.send(data);
      res.render('todo-detail-page', data);
    })
    .catch((error) => { console.log(error); });
});


app.listen(3000, () => {
  console.log('Your server is running!');
});
