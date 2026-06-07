CREATE TABLE tradelog (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50),
    team_name VARCHAR(100),
    action VARCHAR(10),
    pokemon_or_item VARCHAR(100),
    points INT,
    trade_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);