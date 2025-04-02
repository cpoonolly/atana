# Setup

Prerequesites. Please install the following before running:
- [nvm & npm](https://nodejs.org/en/download)
- Your choice of [sqlite CLI client](https://www.sqlite.org/download.html): I used `brew install sqlite`.

Setup steps:
1. Run `nvm use` in the root directory
2. Run `npm install` to download all the needed packages

# Running

This script loads data from the [SCORM Cloud Api](https://cloud.scorm.com/docs/v2/reference/api_overview/) and writes it into tables in a sqllite database. The database is saved on disk as a `.database` file.

In order to run the script, simply run: `npm run start`

## Interacting with the data

Once the script has run you should be able to run queries against your sqlite database using the following commands
```
❯ sqlite3
SQLite version 3.49.1 2025-02-18 13:38:58
Enter ".help" for usage hints.
Connected to a transient in-memory database.
Use ".open FILENAME" to reopen on a persistent database.
sqlite> .open .database
sqlite> .mode line
sqlite> select * from Courses;
sqlite> select * from Learners;
sqlite> select * from Registrations;
sqlite> select
    c.title,
    l.firstName,
    l.lastName,
    r.activityCompletion,
    r.activitySuccess,
    r.score,
    r.totalSecondsTracked
from Registrations r
left join Courses c on c.id = r.CourseId
left join Learners l on l.id = r.LearnerId;
```
