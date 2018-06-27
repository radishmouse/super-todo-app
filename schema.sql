
create table Users (
  id serial primary key,
  username varchar(300) not null unique,
  password_hash varchar(300)
);

create table Todos (
  id serial primary key,
  title varchar(300),
  isDone boolean,
  user_id integer references Users(id)
);
