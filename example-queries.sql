
-- get all the todos, by user
select * from todos where user_id=1;

-- get one todo by id and user
select * from todos where id=2 and user_id=1;

-- get all pending todos, by user
select * from todos where isDone=false and user_id=1;

-- get all finished todos, by user
select * from todos where isDone=true and user_id=1;

-- search by title and user, should have 0 results
select * from todos where title ilike '%zzzzzzzzz%' and user_id=1;

-- search by title and user, should have 1 result
select * from todos where title ilike '%scoop%' and user_id=1;


-- "uncheck" a todo, by user
update todos set isDone=false where id=1 and user_id=1;

-- "check" a todo
update todos set isDone=true where id=2 and user_id=1;

-- change title
update todos set title='cook amazing dinner' where id=3 and user_id=1;

-- change title and isDone
update todos
set
	title='cook the most amazing dinner evarr',
	isDone=true
where id=3 and user_id=1;

-- delete by id
delete from todos where id=3 and user_id=1;

-- delete all finished todos
delete from todos where isDone=true and user_id=1;
