-- Trails

SELECT 'Search for trails in California (First 10)';
SELECT * FROM Trail WHERE t_state = 'California' LIMIT 10;
SELECT '';

SELECT 'Get all comments on a trail (Tunnel View to Dewey Point)';
SELECT c_commentid, u_name, t_name, c_date, c_message, c_reply_to
FROM Trail, Comment, User
WHERE t_name = 'Tunnel View to Dewey Point'
AND c_trailid = t_trailid
AND c_userid = u_userid;
SELECT '';

SELECT 'Get all photos relating to a trail (Tunnel View to Dewey Point)';
SELECT ph_photoid, u_name, c_message
FROM Trail, Comment, User, Photo
WHERE t_name = 'Tunnel View to Dewey Point'
AND ph_trailid = t_trailid
AND ph_commentid = c_commentid
AND c_userid = u_userid;
SELECT '';

-- Plans

SELECT 'Get all plans of a User and their length (57)';
SELECT u_userid, u_name, Plans.p_planid, p_name, plan_length
FROM User, Plans,
	(SELECT p_planid, count(*) as plan_length
	FROM Plans, PlanItem
	WHERE p_planid = pi_planid
	GROUP BY p_planid) Lengths
WHERE u_userid = 57
AND u_userid = p_userid
AND Plans.p_planid = Lengths.p_planid;
SELECT '';

SELECT 'Get a Plan and its items (Plan 7)';
SELECT p_planid, p_name, pi_ordering, pi_trailid, t_name
FROM Plans, PlanItem, Trail
WHERE p_planid = 7
AND p_planid = pi_planid
AND pi_trailid = t_trailid;
SELECT '';

SELECT 'Create new plan as User 57';
INSERT INTO Plans (p_planid,p_userid,p_name)
VALUES (30, 57, 'CoolPlan');
SELECT '';

SELECT 'Add a new item to the plan';
INSERT INTO PlanItem (pi_planid, pi_trailid, pi_ordering)
VALUES (30, 10011926, 0);
INSERT INTO PlanItem (pi_planid, pi_trailid, pi_ordering)
VALUES (31, 10005895, 0);
SELECT '';

SELECT 'Change what trail the first item is';
UPDATE PlanItem
SET pi_trailid = 10031426
WHERE pi_planid = 30
AND pi_ordering = 0;
SELECT '';

SELECT 'Remove trail items from plan';
DELETE FROM PlanItem WHERE pi_planid = 30;
SELECT '';

SELECT 'Remove trail plan';
DELETE FROM Plans WHERE p_planid = 30;
SELECT '';

-- Comments

SELECT 'Post new comment';
INSERT INTO Comment (c_commentid, c_userid, c_trailid, c_date, c_message)
VALUES (66, 7, 10031426, '11/10/2020', 'This trail is great!');
SELECT '';

SELECT 'Attach photo to comment';
INSERT INTO Photo (ph_photoid, ph_commentid, ph_userid, ph_trailid)
VALUES (6, 66, 7, 10031426);
SELECT '';

SELECT 'Get photos attatched to comment';
SELECT * FROM Photo WHERE ph_commentid = 66;
SELECT '';

SELECT 'Reply to a comment';
INSERT INTO Comment (c_commentid, c_userid, c_trailid, c_date, c_message, c_reply_to)
VALUES (67, 8, 10031426, '11/10/2020', 'Yes, I agree!', 66);
SELECT '';

SELECT 'Get all comment replies';
SELECT * FROM Comment WHERE c_reply_to = 66;
SELECT '';

SELECT 'Upvote a comment';
INSERT INTO CommentVote(cv_commentid, cv_userid, cv_vote)
VALUES (67, 7, 'u');
SELECT '';

SELECT 'Edit comment';
UPDATE Comment
SET c_message = 'Haha jk'
WHERE c_commentid = 67;
SELECT '';

SELECT 'Change comment vote';
UPDATE CommentVote
SET cv_vote = 'd'
WHERE cv_userid = 7
AND cv_commentid = 67;
SELECT '';

SELECT 'Remove comment vote';
DELETE FROM CommentVote
WHERE cv_userid = 7
AND cv_commentid = 67;
SELECT '';

SELECT 'Remove comment';
DELETE FROM Comment
WHERE c_commentid = 67;
SELECT '';

SELECT 'Remove comment and photo';
DELETE FROM Photo
WHERE ph_commentid = 66;
DELETE FROM Comment
WHERE c_commentid = 66;
SELECT '';
