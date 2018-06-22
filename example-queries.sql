
-- get all the todos
select * from todos;

-- get one todo by id
select * from todos where id=2;

-- get all pending todos
select * from todos where isDone=false;

-- get all finished todos
select * from todos
where isDone=true;

-- search by title, should have 0 results
select * from todos
where title ilike '%zzzzzzzzz%';

-- search by title, should have 1 result
select * from todos
where title ilike '%scoop%';


-- "uncheck" a todo
update todos
set isDone=false
where id=1;

-- "check" a todo
update todos
set isDone=true
where id=2;

-- change title
update todos
set title='cook amazing dinner'
where id=3;

-- change title and isDone
update todos
set
	title='cook the most amazing dinner evarr',
	isDone=true
where id=3;

-- delete by id
delete from todos where id=3;

-- delete all finished todos
delete from todos
where isDone=true;
