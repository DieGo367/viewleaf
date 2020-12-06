CREATE TABLE Trail (
	t_trailid decimal(30,0) PRIMARY KEY,
	t_name varchar(30),
	t_park varchar(30),
	t_city varchar(30),
	t_state varchar(30),
	t_popularity decimal(10,4),
	t_length decimal(15,4),
	t_elevation_gain decimal(15,4)
);

CREATE TABLE User (
	u_userid decimal(30,0) PRIMARY KEY,
	u_name varchar(30) NOT NULL,
	u_password varchar(30) NOT NULL
);

CREATE TABLE Plans (
	p_planid decimal(30,0) PRIMARY KEY,
	p_userid decimal(30,0) NOT NULL,
	-- FOREIGN KEY(p_userid) REFERENCES User(u_userid),
	p_name varchar(30)
);

CREATE TABLE PlanItem (
	pi_planid decimal(30,0) NOT NULL,
	-- FOREIGN KEY(pi_planid) REFERENCES Plans(p_planid),
	pi_trailid decimal(30,0) NOT NULL,
	-- FOREIGN KEY (pi_trailid) REFERENCES Trail(t_trailid),
	pi_ordering decimal(10,0)
);

CREATE TABLE Comment (
	c_commentid decimal(30,0) PRIMARY KEY,
	c_userid decimal(30,0) NOT NULL,
	-- FOREIGN KEY(c_userid) REFERENCES User(u_userid),
	c_trailid decimal(30,0) NOT NULL,
	-- FOREIGN KEY(c_trailid) REFERENCES Trail(t_trailid),
	c_date date,
	c_message varchar(480),
	c_reply_to decimal(30,0)
);

CREATE TABLE CommentVote (
	cv_commentid decimal(30,0) NOT NULL,
	-- FOREIGN KEY(cv_commentid) REFERENCES Comment(c_commentid),
	cv_userid decimal(30,0) NOT NULL,
	-- FOREIGN KEY(cv_userid) REFERENCES User(u_userid),
	cv_vote char(1)
);

CREATE TABLE Photo (
	ph_photoid decimal(30,0) PRIMARY KEY,
	ph_commentid decimal(30,0) NOT NULL,
	-- FOREIGN KEY(ph_commentid) REFERENCES Comment(c_commentid),
	ph_userid decimal(30,0) NOT NULL,
	-- FOREIGN KEY(ph_userid) REFERENCES User(u_userid),
	ph_trailid decimal(30,0) NOT NULL
	-- FOREIGN KEY (ph_trailid) REFERENCES Trail(t_trailid)
);