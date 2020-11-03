import os
import sys
import csv
import json
import datetime

from typing import List, Tuple, Dict, Set

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

if not (sys.version_info.major == 3 and sys.version_info.minor >= 5):
    print("This script requires Python 3.5 or higher!")
    print("You are using Python {}.{}.".format(sys.version_info.major, sys.version_info.minor))
    sys.exit(1)

def read_events()->List:
    with open('import-data/Event-Grid view.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        return [row for row in reader]

def read_hosehold_tasks()->List:
    with open('import-data/Household task-Grid view.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        return [row for row in reader]

def write_daily_alert(content):
    with open('build/daily_alerts.json', 'w') as outfile:
        json.dump(content, outfile, indent=2)

def get_range_date(numdays: int)-> List[datetime.datetime]:
    base = datetime.date.today()
    date_list = [base + datetime.timedelta(days=x) for x in range(numdays)]
    return date_list

def init_data(dts: List[datetime.datetime])->Dict[str, object]:
    return {d.isoformat(): { "date": d.isoformat(), "weekday": d.isoweekday(), "messages": []} for d in dts}

def populate_events(year: int, events: List, thisdata: Dict[str, object])->Dict[str, object]:
    for event in events:
        month = month_map[event['Month']]
        day = event['Day']
        eventkey = f'{year}-{month}-{day}'
        description = event['Description']
        if not eventkey in thisdata:
            continue
        previous: List[str] = thisdata[eventkey]['messages']
        previous.append(description)

lastest_data = init_data(get_range_date(500))
populate_events(2020, read_events(), lastest_data)
populate_events(2021, read_events(), lastest_data)
write_daily_alert({ "results": lastest_data})
