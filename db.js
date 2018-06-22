const pgp = require('pg-promise')();
const cn = {
  host: 'localhost',
  port: 5432,
  database: 'super-todo-app',
  user: 'postgres',
  password: ''
};
const db = pgp(cn);

function getOne(id) {
  return db.oneOrNone('select * from todos where id=$1', [id]);
}
// getOne(7)
//   .then(function(data) {
//       // success;
//       console.log(data);
//   })
//   .catch(function(error) {
//       // error;
//       console.log('this is the error that happened');
//       console.log(error);
//   });


function getAll() {
  return db.any('select * from todos')
}
// getAll()
//   .then((data) => { console.log(data); })
//   .catch((error) => { console.log(error); });

function getPending() {
  return db.any('select * from todos where isDone=false');
}
// getPending()
//   .then((data) => { console.log(data); })
//   .catch((error) => { console.log(error); });

function getFinished() {
  return db.any('select * from todos where isDone=true');
}
// getFinished()
//   .then((data) => { console.log(data); })
//   .catch((error) => { console.log(error); });

function searchByTitle(searchString) {
  return db.any("select * from todos where title ilike '%$1#%'", [searchString]);
}
// searchByTitle('zzzzzzzzzzzzz')
//   .then((data) => { console.log(data); })
//   .catch((error) => { console.log(error); });

function deleteById(id) {
  return db.result('delete from todos where id=$1', [id]);
}
// deleteById(7)
//   .then((data) => { console.log(data); })
//   .catch((error) => { console.log(error); });

function setFinished(id, isDone) {
  return db.result('update todos set isDone=$1 where id=$2', [isDone, id]);
}
// setFinished(6, false)
//   .then((data) => { console.log(data); })
//   .catch((error) => { console.log(error); });

function setTitle(id, newTitle) {
  return db.result("update todos set title='$1#' where id=$2", [newTitle, id]);
}
// setTitle(6, 'drink some bourbon')
//   .then((data) => { console.log(data); })
//   .catch((error) => { console.log(error); });

function add(title) {
  return db.one("insert into todos (title, isDone) values ('$1#', false) returning id", [title]);
}
// add('drink some more bourbon')
//   .then((data) => { console.log(data); })
//   .catch((error) => { console.log(error); });



module.exports = {
  getOne,
  getAll,
  getPending,
  getFinished,
  searchByTitle,
  deleteById,
  setFinished,
  setTitle,
  add
};

