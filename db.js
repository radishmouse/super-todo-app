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


module.exports = {
  getOne,
  getAll
};

