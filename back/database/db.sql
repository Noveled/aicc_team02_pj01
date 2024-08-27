-- 유저 테이블 생성
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
    user_id INT NOT NULL,
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
	is_private BOOLEAN NOT NULL DEFAULT false,
	center JSON NOT NULL,
	level INT NOT NULL
);

-- 이미지 테이블 생성
CREATE TABLE images_table (
    img_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES running_course_table(course_id) ON DELETE CASCADE, -- FOREIGN KEY 설정
    url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    img_created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- 좋아요 / 즐겨찾기 테이블 생성
CREATE TABLE like (
    id SERIAL PRIMARY KEY,
    course TEXT NOT NULL FOREIGN KEY,
    userId TEXT NOT NULL FOREIGN KEY,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);