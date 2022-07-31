CREATE USER docker;
CREATE DATABASE docker;
GRANT ALL PRIVILEGES ON DATABASE docker TO docker;

CREATE TABLE datiProcessati(
    id int primary key not null, 
    K int,
    D varchar,
    dataora timestamp,
    timestampDataOra bigint GENERATED ALWAYS AS (extract(epoch from dataora) ) stored
);

Create Table datiDaProcessare (
	id int primary key not null,
  P int,
  K int,
  D varchar,
  dataora timestamp
);

CREATE SEQUENCE serialDatiDaProcessare START 1;