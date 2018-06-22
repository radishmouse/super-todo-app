const pgp = require('pg-promise')();
const cn = {
  host: 'localhost',
  port: 5432,
  database: 'super-todo-app',
  user: 'postgres',
  password: ''
};
const db = pgp(cn);

function getTodo(id) {
  db.any('select * from todos where id=$1', [id])
      .then(function(data) {
          // success;
          console.log(data);
      })
      .catch(function(error) {
          // error;
          console.log(error);
      });
}
// getTodo(7);

module.exports = {
  getTodo
};

