-- Create the database if it doesn't exist
IF NOT EXISTS (SELECT name
FROM sys.databases
WHERE name = 'reddit_trends')
BEGIN
    CREATE DATABASE reddit_trends;
END
GO

USE reddit_trends;
GO

-- Create a table to store Reddit posts
IF NOT EXISTS (SELECT *
FROM sys.tables
WHERE name = 'reddit_posts')
BEGIN
    CREATE TABLE reddit_posts
    (
        post_id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(MAX) NOT NULL,
        subreddit VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT GETDATE()
    );
END
GO

-- Create a table to store post trends (score and comments over time)
IF NOT EXISTS (SELECT *
FROM sys.tables
WHERE name = 'post_trends')
BEGIN
    CREATE TABLE post_trends
    (
        post_id VARCHAR(255),
        trend_date DATE,
        score INT NOT NULL,
        num_comments INT NOT NULL,
        PRIMARY KEY (post_id, trend_date),
        FOREIGN KEY (post_id) REFERENCES reddit_posts(post_id) ON DELETE CASCADE
    );
END
GO

-- Create an index on post_trends.trend_date for faster trend analysis
IF NOT EXISTS (SELECT name
FROM sys.indexes
WHERE name = 'idx_post_trends_date' AND object_id = OBJECT_ID('post_trends'))
BEGIN
    CREATE INDEX idx_post_trends_date ON post_trends (trend_date);
END
GO