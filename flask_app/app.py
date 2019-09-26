import os

import pandas as pd
import numpy as np
import math as math
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
from sqlalchemy.ext.declarative import declarative_base


#################################################
# Database Setup
#################################################
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:postgres@:5432/CTA"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

#
# session = Session(engine)

# Save references to each table
Total_Data = Base.classes.total_ridership
Weekday_Data = Base.classes.weekday_data
Saturday_Data = Base.classes.saturday_data
Sunday_Data = Base.classes.sunday_holiday_data
Ten_Year_Ridership = Base.classes.ten_year_ridership


# This is the first route
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/metadata/<station>")
def station_metadata(station):
    """Return the MetaData for a given sample."""
    sel = [
        Total_Data.Station_Name,
        Total_Data.ADA,
        Total_Data.Red,
        Total_Data.Blue,
        Total_Data.Green,
        Total_Data.Brown,
        Total_Data.Purple,
        Total_Data.Purple_Express,        
        Total_Data.Yellow,
        Total_Data.Pink,
        Total_Data.Orange  
    ]

    col_names = Total_Data.__table__.columns.keys()


    
								
    results = db.session.query(*sel).filter(Total_Data.Station_Name == station).all()

    # print(col_names)

    color = {}
    for result in results:
        color["Red"] = result[2]
        color["Blue"] = result[3]
        color["Green"] = result[4]
        color["Brown"] = result[5]
        color["Purple"] = result[6]
        color["Purple_Express"] = result[7]   
        color["Yellow"] = result[8]
        color["Pink"] = result[9]
        color["Orange"] = result[10] 

    # print (color)

    colors = {}
    line_color = []

    # Search for values which are True in the dict and return the keys
    for key, value in color.items():
        if True == value:
            line_color.append(key)

    # add space between list items
    line_color = [ f' {x} ' for x in line_color]
    colors["Line Color(s)"] = line_color
    print(colors)

    station_metadata = {}
    for result in results:
        station_metadata["Station-Name"] = result[0]
        station_metadata["ADA"] = result[1]  

    # append the line-color dict into the metadata dict
    station_metadata.update(colors)
    return jsonify(station_metadata)


@app.route("/stations")
def stations():
    sel = [Total_Data.Station_Name]

    stations = [station[0] for station in db.session.query(*sel).all()]

    return jsonify(stations)

@app.route("/total/<station>")
def total_ridership(station):

    stmt = db.session.query(Total_Data).statement

    df = pd.read_sql_query(stmt, db.session.bind)

    ridership_data = df.loc[df['Station_Name'] == station]

    years = list(df.columns)[3:14]
    
    ridership = ridership_data.values[0][3:14]
    ridershipnona = [0 if math.isnan(x) else x for x in ridership]
   
    data = {
        'year': years,
        'ridership': ridershipnona
    }

    return jsonify(data)


@app.route("/station/<station>")
def daily_ridership(station):

    stmt_weekday = db.session.query(Weekday_Data).statement
    
    weekday_df = pd.read_sql_query(stmt_weekday, db.session.bind)

    weekday_ridership_data = weekday_df.loc[weekday_df['Station_Name'] == station]

    years = list(weekday_df.columns)[3:14]

    weekday_ridership = weekday_ridership_data.values[0][3:14]
    weekday_ridershipnona = [0 if math.isnan(x) else x for x in weekday_ridership]

    # Saturday Data 

    stmt_saturday = db.session.query(Saturday_Data).statement
    
    saturday_df = pd.read_sql_query(stmt_saturday, db.session.bind)

    saturday_ridership_data = saturday_df.loc[saturday_df['Station_Name'] == station]

    saturday_ridership = saturday_ridership_data.values[0][3:14]
    saturday_ridershipnona = [0 if math.isnan(x) else x for x in saturday_ridership]
    # print(saturday_ridershipnona)
    # Sunday Holiday Data 

    stmt_sunday = db.session.query(Sunday_Data).statement
    
    sunday_df = pd.read_sql_query(stmt_sunday, db.session.bind)

    sunday_ridership_data = sunday_df.loc[sunday_df['Station_Name'] == station]

    sunday_ridership = sunday_ridership_data.values[0][3:14]
    sunday_ridershipnona = [0 if math.isnan(x) else x for x in sunday_ridership]

    data = {
        'year': years,
        'weekday_ridership': weekday_ridershipnona,
        'saturday_ridership': saturday_ridershipnona,
        'sunday_ridership': sunday_ridershipnona       
    }

    return jsonify(data)


@app.route("/years")
def years():
    #get list of years and column placement for iloc.  assumes year columns start at position 2
    startyear = 2008
    totalyears = 10
    years = [] 
    for x in range(0,totalyears+1):
        if x == 0:
            year = startyear
            years.append(year)
        else:
            year = year + 1
            years.append(year)

    return jsonify(years)

@app.route("/years/<year>")
def ten_year_ridership(year):
    #get list of years and column placement for iloc.  assumes year columns start at position 2
    startyear = 2008
    totalyears = 10
    years = [] 
    references = []
    for x in range(0,totalyears+1):
        if x == 0:
            year2 = startyear
            years.append(year2)
            reference = 3
            references.append(reference)
        else:
            year2 = year2 + 1
            years.append(year2)
            reference = reference + 1
            references.append(reference)
    year_dict = dict(zip(years, references))
    #get column number based on users chosen year
    column = year_dict[int(year)]
    # print(column)
    # #pull in data from the database
    stmt = db.session.query(Ten_Year_Ridership).statement

    df = pd.read_sql_query(stmt, db.session.bind)
    # #get the ridership data for the year chosen
    ridership_data = df.iloc[:, column].tolist()
    ridershipnona = [0 if math.isnan(x) else x for x in ridership_data]
    # print(ridership_data)
    #get the list of station names.  assumes position 1 in table of database
    stations = df.iloc[:, 2].tolist()
    lat = df.iloc[:,25].tolist()
    lon = df.iloc[:,26].tolist()
    #ridership = ridership_data.values[0][3:]

    data = {
        'ridership': ridershipnona,
        'lat' : lat,
        'lon' : lon,
        'stations': stations          
    }
    data2 = pd.DataFrame(data).to_dict('records')
    return jsonify(data2)
    

if __name__ == "__main__":
    app.run()
