const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const Todo = require('./db');


const expressHbs = require('express-handlebars');

app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

const static = express.static;
app.use(static('public'));


app.get('/', (req, res) => {
  Todo.getAll()
    .then((data) => {
      console.log(data);
      // res.send(data);
      res.render('homepage', {
        todos: data
      });
     })
    .catch((error) => { console.log(error); });
});


app.get('/new', (req, res) => {
  console.log('This is the /new route');
  res.render('todo-create-page');
});

app.post('/new', (req, res) => {
  console.log(req.body);
  // res.send('hey you submitted the form');

  Todo.add(req.body.title)
    .then((data) => {
      // console.log(data);
      // res.send(data);
      res.redirect(`/${data.id}`);
    })

});


app.get('/:id/edit', (req, res) => {
  // show the form, but populate with
  // the current todo
  Todo.getOne(req.params.id)
    .then((data) => {
      console.log(data);
      // res.send(data);
      res.render('todo-edit-page', data);
    })
});

app.post('/:id/edit', (req, res) => {
  let newTitle = req.body.title;
  let isDone = false;
  if (req.body.finished) {
    isDone = true;
  }

  Todo.setTitle(req.params.id, newTitle)
    .then((data) => {

      Todo.setFinished(req.params.id, isDone)
        .then((data) => {
          // res.redirect(`/${req.params.id}/edit`);
          res.redirect(`/`);
        })
    });
});

app.get('/:id', (req, res) => {
  console.log('This is the /:id route');
  Todo.getOne(req.params.id)
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
