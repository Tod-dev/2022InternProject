#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
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
EOSQL