# Intern Project

### init sql

(controllare che il file sh non sia formattato come file dos)
vi ./init-database.sh
:set fileformat=unix
:wq!

## start containers:

docker compose up

## Script Utility:

cd backend && yarn utility

## ports

frontend: 3000

backend: 3001

db: 5432
