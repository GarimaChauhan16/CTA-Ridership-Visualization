ALTER TABLE total_ridership ADD PRIMARY KEY ("Station_ID");
ALTER TABLE weekday_data ADD PRIMARY KEY ("Station_ID");
ALTER TABLE saturday_data ADD PRIMARY KEY ("Station_ID");
ALTER TABLE sunday_holiday_data ADD PRIMARY KEY ("Station_ID");
ALTER TABLE ten_year_ridership ADD PRIMARY KEY ("Station_ID");

SELECT * FROM total_ridership;

