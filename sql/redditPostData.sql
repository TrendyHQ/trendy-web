-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS reddit_trends;
USE reddit_trends;
-- Create a table to store Reddit posts
CREATE TABLE IF NOT EXISTS reddit_posts (
    post_id VARCHAR(255) PRIMARY KEY,
    title TEXT NOT NULL,
    subreddit VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Create a table to store post trends (score and comments over time)
CREATE TABLE IF NOT EXISTS post_trends (
    post_id VARCHAR(255),
    date DATE,
    score INT,
    num_comments INT,
    PRIMARY KEY (post_id, date),
    FOREIGN KEY (post_id) REFERENCES reddit_posts(post_id) ON DELETE CASCADE
);
--Create a table to store the user and their saved trends
CREATE TABLE IF NOT EXISTS user_trends (
    user_id VARCHAR(255),
    post_id VARCHAR(255),
    PRIMARY KEY (user_id, post_id, date),
    FOREIGN KEY (post_id) REFERENCES reddit_posts(post_id) ON DELETE CASCADE
);

-- Create a table to store a trend on trendy with its corresponding id and comments
CREATE TABLE IF NOT EXISTS trend_information (
    trend_id VARCHAR(255) PRIMARY KEY,
    trend_comments JSON,
    trend_likes INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on post_trends.date for faster trend analysis
CREATE INDEX idx_post_trends_date ON post_trends (date);