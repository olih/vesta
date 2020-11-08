import os
import sys
import csv
import json
import configparser
from datetime import datetime, timedelta, date
from typing import List, Tuple, Dict, Set

config = configparser.ConfigParser()
config.read(".vesta.ini")
import_data = config['import-data']
export_data = config['export-data']

month_map = {
    "Jan": "01",
    "Feb": "02",
    "Mar": "03",
    "Apr": "04",
    "May": "05",
    "Jun": "06",
    "Jul": "07",
    "Aug": "08",
    "Sep": "09",
    "Oct": "10",
    "Nov": "11",
    "Dec": "12"
}

reminder_map = {
    "None": 0,
    "Three days before": -3,
    "A week before": -7
}

frequency_map = {
    "Daily": 1,
    "Weekly": 7,
    "Fortnightly": 14,
    "Monthly": 30,
    "Quaterly": 90,
    "Yearly": 365
}

if not (sys.version_info.major == 3 and sys.version_info.minor >= 5):
    print("This script requires Python 3.5 or higher!")
    print("You are using Python {}.{}.".format(sys.version_info.major, sys.version_info.minor))
    sys.exit(1)

def read_events()->List:
    with open(import_data.get('event'), newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        return [row for row in reader]

def read_hosehold_tasks()->List:
    with open(import_data.get('task'), newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        return [row for row in reader]

def write_daily_alert(content):
    with open(export_data.get('daily_alerts'), 'w') as outfile:
        json.dump(content, outfile, indent=2)

def date_from_string(value: str)->datetime:
    return date.fromisoformat(value)

def create_date(year: int, month: int, day: int)->datetime:
    return date(year, month, day)

def add_days(base: datetime.date, days: int)->datetime:
    return base + timedelta(days=days)

def get_range_date(base: datetime.date, numdays: int)-> List[datetime]:
    date_list = [add_days(base, x) for x in range(numdays)]
    return date_list

def init_data(dts: List[datetime])->Dict[str, object]:
    thisdata = {d.isoformat(): { "date": d.isoformat(), "weekday": d.isoweekday(), "messages": []} for d in dts}
    # Adds weekdays
    thisdata["weekdays"] = {
        1: [d.isoformat() for d in dts if d.isoweekday() == 1],
        5: [d.isoformat() for d in dts if d.isoweekday() == 5],
        6: [d.isoformat() for d in dts if d.isoweekday() == 6],
        7: [d.isoformat() for d in dts if d.isoweekday() == 7]
    }
    return thisdata

def populate_events(year: int, events: List, thisdata: Dict[str, object])->Dict[str, object]:
    for event in events:
        month = int(month_map[event['Month']])
        day = int(event['Day'])
        date_event_key = create_date(year, month, day)
        eventkey = date_event_key.isoformat()
        description = event['Description']
        if not eventkey in thisdata:
            continue
        previous: List[str] = thisdata[eventkey]['messages']
        previous.append(description)
        # Reminder
        reminder_days = reminder_map[event["Reminder"]]
        if reminder_days >= 0:
            continue
        reminder_date_event_key = add_days(date_event_key, reminder_days)
        reminder_eventkey = reminder_date_event_key.isoformat()
        if not reminder_eventkey in thisdata:
            continue
        previous_reminder: List[str] = thisdata[reminder_eventkey]['messages']
        previous_reminder.append(f"Reminder: on {event['Day']} {event['Month']}, {description}")

start_date = date_from_string("2020-11-01")
lastest_data = init_data(get_range_date(start_date, 500))
populate_events(2020, read_events(), lastest_data)
populate_events(2021, read_events(), lastest_data)
write_daily_alert({ "results": lastest_data})
