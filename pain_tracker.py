import json
from datetime import datetime
import sys
from pathlib import Path

DATA_FILE = Path('pain_data.json')


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
    data.append({'level': level, 'description': description, 'timestamp': timestamp})
    data.sort(key=lambda x: x['timestamp'])
    save_data(data)
    print('Entrada adicionada com sucesso.')


def show_timeline():
    data = load_data()
    if not data:
        print('Nenhuma entrada registrada.')
        return
    for item in data:
        time = item['timestamp']
        level = item['level']
        desc = item['description']
        print(f"{time} - Nível {level}: {desc}")


def usage():
    print('Uso: python pain_tracker.py [adicionar|linha_do_tempo] ...')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        usage()
        sys.exit(1)
    cmd = sys.argv[1]
    if cmd == 'adicionar':
        if len(sys.argv) < 4:
            print('Uso: python pain_tracker.py adicionar <nivel_de_dor> <descricao>')
            sys.exit(1)
        level = sys.argv[2]
        description = ' '.join(sys.argv[3:])
        add_entry(level, description)
    elif cmd == 'linha_do_tempo':
        show_timeline()
    else:
        usage()
