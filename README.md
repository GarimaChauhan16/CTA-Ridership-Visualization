# Project Details:

## CTA Rideship Trend visualization last 10 Years.

Team Members: 
1. Amy Cleveland
2. Gabriela Hernandez
3. Garima Chauhan
4. Joseph Wantroba
5. Kelly Lao

![CTA](https://66.media.tumblr.com/342ad1138cd863a717668473ab34643b/tumblr_nn89tp0aMs1qa07aro4_500.gif)

In this project we built a web dashboard which shows a ridership trend for the Chicago Transit Authority (CTA) over last years.


## Data Collection

The data was collected from Chicago Data Portal Website.
https://data.cityofchicago.org/

The Data set-1 (https://data.cityofchicago.org/Transportation/CTA-Ridership-L-Station-Entries-Monthly-Day-Type-A/t2rn-p8d7) includes the total monthly ridership data as well as day type (weekday, saturday  weekend/ holiday) ridership data from Year 2001 till 2018.

The Data set-2 (https://data.cityofchicago.org/Transportation/CTA-System-Information-List-of-L-Stops/8pix-ypme) includes the Station/Line information such as Station Name, ADA accessibility, Line color, Location ( Latitude and Longitude) for each Station/Stop/Line.

## Data Cleaning

We extracted last 10 years total ridership data from the data set-1 and merged it with the sata set-2 in order to get the information about each station.

## Database and backend server

We used SQL database in Postgres to store the data and created a flask server to load the data into Python.

## Front end visualization

We used html, D3, Javascript, Plotly and Leaflet to build our final visualization dashboard.

## The visualization dashboard includes:
- Chicago map with CTA Stations and lines with Ridership information and a dropdown menu to select the year. The bubbles represent the CTA stations with bubble size and color representing the ridership data.

![CTA_Map](Images/CTA_Map.png)


- A line chart showing total ridership data for last 10 years and a dropdown menu to select the station from. The station information includes the ADA accessibility and Line color information.

- A stacked bar graph which represents the average ridership data for different week day types.

![Line](Images/Chart.png)