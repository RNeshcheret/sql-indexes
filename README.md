# sql-indexes

### Run MySql within docker

```bash
docker-compose up -d
```

### Fill DB with user records (40M by default)

```bash
node insert-data.js
```

### Set/Delete index on the DOB field

```bash
node ./db/manage-index.js --create # creates beetree index
node ./db/manage-index.js --create hash # creates hash index
node ./db/manage-index.js --drop # drops the index
```

### Run test fetching data to compare performans

```bash
node test-fetch.js
```

### Performance Metrics: No Index vs Index

| Query                                       | No Index (ms) | B-Tree Index (ms) | Hash (ms) |
| ------------------------------------------- | ------------- | ----------------- | --------- |
| `SELECT * FROM users WHERE dob > ?`         | 54.73         | 413.90            | 326.73    |
| `SELECT * FROM users WHERE dob = ?`         | 5723.42       | 502.21            | 407.71    |
| `SELECT * FROM users WHERE dob < ?`         | 9.13          | 190.55            | 175.39    |
| `SELECT * FROM users WHERE name LIKE ?`     | 12387.29      | 12669.01          | 11156.00  |
| `ALTER TABLE users ADD INDEX idx_dob (dob)` | -             | 50219.06          | 48262.39  |
| `ALTER TABLE users DROP INDEX idx_dob`      | -             | 197.76            | 146.93    |

## innodb_flush_log_at_trx_commit

The innodb_flush_log_at_trx_commit parameter controls the balance between performance and durability in InnoDB:

Value 0: Logs are written to the log file and flushed to disk once per second.
Value 1: Logs are written and flushed to disk at each transaction commit.
Value 2: Logs are written to the log file at each transaction commit but flushed to disk once per second.

### Check current value

```sh
docker exec -it mysql-test mysql -u root -p  -e "SHOW VARIABLES LIKE 'innodb_flush_log_at_trx_commit';"
```

### Change innodb_flush_log_at_trx_commit value

```sh
docker exec -it mysql-test mysql -u root -p  -e "SET GLOBAL innodb_flush_log_at_trx_commit = 0;"
```

### Performance Metrics with different innodb_flush_log_at_trx_commit option

Run insert script to inser 1M items per 100 batch size

```sh
node insert-data.js --items-size 1000000 --batch-size 100
```

| innodb_flush_log_at_trx_commit | No Index (ms) | B-Tree Index (ms) | Hash (ms) |
| ------------------------------ | ------------- | ----------------- | --------- |
| 0                              | 70064.86      | 211698.79         | 227895.96 |
| 1                              | 82400.35      | 197375.96         | 175704.25 |
| 2                              | 70066.50      | 205872.71         | 142387.54 |
