CREATE TABLE IF NOT EXISTS outcomes_cip
(
    providerid character varying(16),
    cipcode character varying(16),
    PerEmployed2 decimal,
    PerEmployed4 decimal,
    PerEmployed8 decimal,
    AvgQuarterlyWage2 decimal,
    AvgQuarterlyWage4 decimal,
    AvgQuarterlyWage8 decimal,
    PerRetention4 decimal,
    PerRetention8 decimal,
    NumCompleted2 integer,
    NumCompleted4 integer,
    NumCompleted8 integer,
    NumUsedWageCalc2 integer,
    NumUsedWageCalc4 integer,
    NumUsedWageCalc8 integer,
    NumUsedRetentionCalc4 integer,
    NumUsedRetentionCalc8 integer,
    id serial NOT NULL PRIMARY KEY
);
