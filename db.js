const pgp = require('pg-promise')();
const cn = {
  host: 'localhost',
  port: 5432,
  database: 'super-todo-app',
  user: 'postgres',
  password: ''
};
const db = pgp(cn);

const bcrypt = require('bcrypt');

function getOne(userId, id) {
  return db.oneOrNone('select * from todos where id=$1 and user_id=$2', [id, userId]);
}
// getOne(1, 3)
//   .then(function(data) {
//       // success;
//       console.log(data);
//   })
//   .catch(function(error) {
//       // error;
//       console.log('this is the error that happened');
//       console.log(error);
//   });


function getAll(userId) {
  return db.any('select * from todos where user_id=$1', [userId])
}
// getAll(1)
//   .then((data) => { console.log(data); })
//   .catch((error) => { console.log(error); });

function getPending(userId) {
  return db.any('select * from todos where isDone=false and user_id=$1', [userId]);
}
// getPending(1)
//   .then((data) => { console.log(data); })
//   .catch((error) => { console.log(error); });

function getFinished(userId) {
  return db.any('select * from todos where isDone=true and user_id=$1', [userId]);
}
// getFinished(1)
//   .then((data) => { console.log(data); })
//   .catch((error) => { console.log(error); });

function searchByTitle(userId, searchString) {
  return db.any("select * from todos where title ilike '%$1#%' and user_id=$2", [searchString, userId]);
}
// searchByTitle(1, 'cook')
//   .then((data) => { console.log(data); })
//   .catch((error) => { console.log(error); });
// searchByTitle(1, 'zzzzzzzzzzzzz')
//   .then((data) => { console.log(data); })
//   .catch((error) => { console.log(error); });

function deleteById(userId, id) {
  return db.result('delete from todos where id=$1 and user_id=$2', [id, userId]);
}
// deleteById(1, 3)
//   .then((data) => { console.log(data); })
//   .catch((error) => { console.log(error); });

function setFinished(userId, id, isDone) {
  return db.result('update todos set isDone=$1 where id=$2 and user_id=$3', [isDone, id, userId]);
}
// setFinished(1, 2, false)
//   .then((data) => { console.log(data); })
//   .catch((error) => { console.log(error); });

function setTitle(userId, id, newTitle) {
  return db.result("update todos set title='$1#' where id=$2 and user_id=$3", [newTitle, id, userId]);
}
// setTitle(1, 1, 'drink some bourbon')
//   .then((data) => { console.log(data); })
//   .catch((error) => { console.log(error); });

function add(userId, title) {
  console.log('adding...');
  return db.one("insert into todos (title, isDone, user_id) values ('$1#', false, $2) returning id", [title, userId]);
}
// add(1, 'drank some more bourbon')
//   .then((data) => { console.log(data); })
//   .catch((error) => { console.log(error); });

// =====

function createUser(username, password) {
  let hash = bcrypt.hashSync(password, 10);
  return db.one("insert into users (username, password_hash) values ('$1#', '$2#') returning id", [username, hash]);
}
// createUser('milla', 'mow')
//   .then((data) => { console.log(data); })
//   .catch((error) => { console.log(error); });

function getUser(username) {
  return db.oneOrNone("select * from users where username='$1#'", [username]);
}
// getUser('milla')
//   .then((data) => { console.log(data); })
//   .catch((error) => { console.log(error); });

function authenticateUser(username, password) {
  return getUser(username)
          .then((user) => {
            return bcrypt.compareSync(password, user.password_hash)
          })
          .catch((error) => false);

}
// authenticateUser('milla', 'mow')
//   .then((data) => { console.log(data); })
//   .catch((error) => { console.log(error); });


module.exports = {
  Todo: {
    getOne,
    getAll,
    getPending,
    getFinished,
    searchByTitle,
    deleteById,
    setFinished,
    setTitle,
    add,
  },
  User: {
    createUser,
    authenticateUser
  }
};

