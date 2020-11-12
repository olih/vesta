import os
import sys
import csv
import json
import configparser
import re
from datetime import datetime, timedelta, date
from typing import List, Tuple, Dict, Set

config = configparser.ConfigParser()
config.read(".vesta.ini")
import_data = config['import-data']
export_data = config['export-data']
export_json = export_data.get('export_json')

non_std_chars_patt = re.compile(r'[^A-Za-z0-9]')

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

frequency_week_map = {
    "Weekly": 1,
    "Fortnightly": 2,
    "Monthly": 4,
    "Quaterly": 12,
    "Yearly": 52
}

frequency_section_map = {
    "Weekly": "casual_tasks",
    "Fortnightly": "casual_tasks",
    "Monthly": "casual_tasks",
    "Quaterly": "occasional_tasks",
    "Yearly": "occasional_tasks"
}

if not (sys.version_info.major == 3 and sys.version_info.minor >= 5):
    print("This script requires Python 3.5 or higher!")
    print("You are using Python {}.{}.".format(
        sys.version_info.major, sys.version_info.minor))
    sys.exit(1)


def read_events() -> List:
    with open(import_data.get('event'), newline='', encoding='utf-8-sig') as csvfile:
        reader = csv.DictReader(csvfile)
        return [row for row in reader]


def read_household_tasks() -> List:
    with open(import_data.get('task'), newline='', encoding='utf-8-sig') as csvfile:
        reader = csv.DictReader(csvfile)
        return [row for row in reader]

def read_cooking() -> List:
    with open(import_data.get('cooking'), newline='', encoding='utf-8-sig') as csvfile:
        reader = csv.DictReader(csvfile)
        return [row for row in reader]

def read_ingredient() -> List:
    with open(import_data.get('ingredient'), newline='', encoding='utf-8-sig') as csvfile:
        reader = csv.DictReader(csvfile)
        return [row for row in reader]

def write_daily_alert(items):
    for k in items:
        content = items[k]
        with open(f"{export_json}/alert_{k}.json", 'w') as outfile:
            json.dump(content, outfile, indent=2)


def date_from_string(value: str) -> datetime:
    return date.fromisoformat(value)


def create_date(year: int, month: int, day: int) -> datetime:
    return date(year, month, day)


def add_days(base: datetime.date, days: int) -> datetime:
    return base + timedelta(days=days)


def get_range_date(base: datetime.date, numdays: int) -> List[datetime]:
    date_list = [add_days(base, x) for x in range(numdays)]
    return date_list


def init_data(dts: List[datetime]) -> Dict[str, object]:
    thisdata = {d.isoformat(): {
        "date": d.isoformat(),
        "date-human": d.strftime("%A, %d %B"),
        "weekday": d.isoweekday(),
        "events": [],
        "casual_tasks": [],
        "occasional_tasks": []
    }
        for d in dts}
    # Adds weekdays
    thisdata["weekdays"] = {
        1: [d.isoformat() for d in dts if d.isoweekday() == 1],
        5: [d.isoformat() for d in dts if d.isoweekday() == 5],
        6: [d.isoformat() for d in dts if d.isoweekday() == 6],
        7: [d.isoformat() for d in dts if d.isoweekday() == 7]
    }
    return thisdata


def name_to_id(name: str) -> str:
    return non_std_chars_patt.sub("-", name.lower())


def create_event(name: str, description: str, flags: str):
    return {"id": name_to_id(name),
            "description": description,
            "flags": flags}

def create_task(name: str, description: str, flags: str):
    return {"id": name_to_id(name),
            "description": description,
            "flags": flags}


def populate_events(year: int, events: List, thisdata: Dict[str, object]) -> Dict[str, object]:
    for event in events:
        month = int(month_map[event['Month']])
        day = int(event['Day'])
        date_event_key = create_date(year, month, day)
        eventkey = date_event_key.isoformat()
        name = event['Name']
        description = event['Description']
        if not eventkey in thisdata:
            continue
        previous: List[str] = thisdata[eventkey]['events']
        previous.append(create_event(name, description, "event"))
        # Reminder
        reminder_days = reminder_map[event["Reminder"]]
        if reminder_days >= 0:
            continue
        reminder_date_event_key = add_days(date_event_key, reminder_days)
        reminder_eventkey = reminder_date_event_key.isoformat()
        if not reminder_eventkey in thisdata:
            continue
        previous_reminder: List[str] = thisdata[reminder_eventkey]['events']
        previous_reminder.append(create_event(
            name, f"Reminder: on {event['Day']} {event['Month']}, {description}", "reminder"))


def populate_daily_tasks(year: int, tasks: List, thisdata: Dict[str, object]) -> Dict[str, object]:
    daily_tasks = [create_task(t['Name'], t['Description'], t['Frequency']) for t in tasks]
    for k in thisdata:
        bucket = thisdata[k]
        if not "casual_tasks" in bucket:
            continue
        casual_tasks: List = bucket['casual_tasks']
        casual_tasks.extend(daily_tasks)

def create_array_shape(dim: int)->List:
    results = []
    for _ in range(dim):
       results.append([])
    return results

def reshape_roughly(values: List, dim: int)->List:
    results = create_array_shape(dim)
    for i in range(len(values)):
        j = i % dim
        results[j].append(values[i])
    return results

def populate_regular_tasks(year: int, tasks: List, thisdata: Dict[str, object]) -> Dict[str, object]:
    if len(tasks) is 0:
        return
    regular_tasks = [create_task(t['Name'], t['Description'], t['Frequency']) for t in tasks]
    week_step = frequency_week_map[tasks[0]['Frequency']]
    shaped_tasks = reshape_roughly(regular_tasks, week_step)
    monday_weekdays = thisdata['weekdays'][1]
    for i in range(len(monday_weekdays)):
        j = i % week_step
        k = monday_weekdays[i]
        bucket = thisdata[k]
        if not "casual_tasks" in bucket:
            continue
        tasks_to_add =  shaped_tasks[j]
        casual_tasks: List = bucket[frequency_section_map[tasks[0]['Frequency']]]
        casual_tasks.extend(tasks_to_add)


def populate_tasks(year: int, tasks: List, thisdata: Dict[str, object]) -> Dict[str, object]:
    populate_daily_tasks(
        year, [t for t in tasks if t['Frequency'] == "Daily"], thisdata)
    populate_regular_tasks(
        year, [t for t in tasks if t['Frequency'] == "Weekly"], thisdata)
    populate_regular_tasks(
        year, [t for t in tasks if t['Frequency'] == "Fortnightly"], thisdata)
    populate_regular_tasks(
        year, [t for t in tasks if t['Frequency'] == "Monthly"], thisdata)
    populate_regular_tasks(
        year, [t for t in tasks if t['Frequency'] == "Quaterly"], thisdata)
    populate_regular_tasks(
        year, [t for t in tasks if t['Frequency'] == "Yearly"], thisdata)


start_date = date_from_string("2020-11-01")
lastest_data = init_data(get_range_date(start_date, 500))
populate_events(2020, read_events(), lastest_data)
populate_events(2021, read_events(), lastest_data)
populate_tasks(2020, read_household_tasks(), lastest_data)

write_daily_alert(lastest_data)
