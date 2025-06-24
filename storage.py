import json
from datetime import datetime
import uuid
from pathlib import Path

DATA_FILE = Path("pain_data.json")


def load_data():
    """Load entries from disk and ensure each has a unique id."""
    if DATA_FILE.exists():
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
    else:
        data = []

    # Backwards compatibility: add ids to old entries
    changed = False
    for entry in data:
        if 'id' not in entry:
            entry['id'] = uuid.uuid4().hex
            changed = True
    if changed:
        save_data(data)
    return data


def save_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def add_entry(level, description, timestamp=None):
    """Add a new pain entry and return it."""
    data = load_data()
    if timestamp is None:
        timestamp = datetime.now().isoformat()
    entry = {
        'id': uuid.uuid4().hex,
        'level': level,
        'description': description,
        'timestamp': timestamp,
    }
    data.append(entry)
    data.sort(key=lambda x: x['timestamp'])
    save_data(data)
    return entry


def remove_entry(entry_id):
    """Remove an entry by id. Return True if removed."""
    data = load_data()
    new_data = [e for e in data if e.get('id') != entry_id]
    if len(new_data) == len(data):
        return False
    save_data(new_data)
    return True


def compute_stats():
    """Return statistics about stored entries."""
    data = load_data()
    if not data:
        return {
            'total': 0,
            'media_nivel': 0,
            'nivel_maximo': 0,
        }
    total = len(data)
    levels = [int(e['level']) for e in data]
    media = sum(levels) / total
    nivel_max = max(levels)
    return {
        'total': total,
        'media_nivel': round(media, 2),
        'nivel_maximo': nivel_max,
    }
