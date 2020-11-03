import os
import sys
import csv
import json
import datetime

from typing import List, Tuple, Dict, Set

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

def init_data(dts: List[datetime.datetime])->List:
    return {d.isoformat(): { "date": d.isoformat(), "weekday": d.isoweekday(), "messages": []} for d in dts}

lastest_data = init_data(get_range_date(40))
write_daily_alert({ "results": lastest_data})
