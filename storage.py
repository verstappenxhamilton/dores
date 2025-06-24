import json
from datetime import datetime
from pathlib import Path

DATA_FILE = Path("pain_data.json")


def load_data():
    if DATA_FILE.exists():
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []


def save_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def add_entry(level, description, timestamp=None):
    data = load_data()
    if timestamp is None:
        timestamp = datetime.now().isoformat()
    entry = {'level': level, 'description': description, 'timestamp': timestamp}
    data.append(entry)
    data.sort(key=lambda x: x['timestamp'])
    save_data(data)
    return entry
