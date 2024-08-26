CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    password_hash TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT UNIQUE NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 코스 테이블 생성
CREATE TABLE running_course_table (
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(40) NOT NULL,
    user_id VARCHAR(20) NOT NULL, -- FOREIGN KEY
	content VARCHAR(500) NOT NULL,
	thumbnail_id TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    liked INT NOT NULL,
    distance FLOAT NOT NULL,
    viewcount INT NOT NULL,
    waypoint JSON NOT NULL,
	city VARCHAR(20) NOT NULL,
	is_marathon BOOLEAN NOT NULL DEFAULT false,
	is_visible BOOLEAN NOT NULL DEFAULT true,
	is_priavte BOOLEAN NOT NULL DEFAULT false
);

SELECT * FROM running_course_table;

CREATE TABLE like (
    id SERIAL PRIMARY KEY,
    course TEXT NOT NULL FOREIGN KEY,
    userId TEXT NOT NULL FOREIGN KEY,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);