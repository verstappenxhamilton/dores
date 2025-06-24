import json
from datetime import datetime
from pathlib import Path
import argparse

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


def build_parser():
    parser = argparse.ArgumentParser(description="Registre crises de dor crônica")
    subparsers = parser.add_subparsers(dest="command")

    add_cmd = subparsers.add_parser("adicionar", help="Adicionar nova ocorrência")
    add_cmd.add_argument("nivel", help="Nível da dor")
    add_cmd.add_argument("descricao", help="Descrição da dor")
    add_cmd.add_argument("--timestamp", help="Data e hora no formato ISO", default=None)

    subparsers.add_parser("linha_do_tempo", help="Mostrar linha do tempo")
    return parser


def main(argv=None):
    parser = build_parser()
    args = parser.parse_args(argv)

    if args.command == "adicionar":
        add_entry(args.nivel, args.descricao, timestamp=args.timestamp)
    elif args.command == "linha_do_tempo":
        show_timeline()
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
