import argparse

from storage import load_data, add_entry, remove_entry


def show_timeline():
    data = load_data()
    if not data:
        print('Nenhuma entrada registrada.')
        return
    for item in data:
        time = item['timestamp']
        level = item['level']
        desc = item['description']
        entry_id = item.get('id', 'sem-id')
        print(f"[{entry_id}] {time} - Nível {level}: {desc}")


def build_parser():
    parser = argparse.ArgumentParser(description="Registre crises de dor crônica")
    subparsers = parser.add_subparsers(dest="command")

    add_cmd = subparsers.add_parser("adicionar", help="Adicionar nova ocorrência")
    add_cmd.add_argument("nivel", type=int, help="Nível da dor")
    add_cmd.add_argument("descricao", help="Descrição da dor")
    add_cmd.add_argument("--timestamp", help="Data e hora no formato ISO", default=None)

    subparsers.add_parser("linha_do_tempo", help="Mostrar linha do tempo")

    remove_cmd = subparsers.add_parser("remover", help="Remover entrada pelo ID")
    remove_cmd.add_argument("id", help="ID da entrada a remover")
    return parser


def main(argv=None):
    parser = build_parser()
    args = parser.parse_args(argv)

    if args.command == "adicionar":
        add_entry(args.nivel, args.descricao, timestamp=args.timestamp)
        print('Entrada adicionada com sucesso.')
    elif args.command == "linha_do_tempo":
        show_timeline()
    elif args.command == "remover":
        if remove_entry(args.id):
            print('Entrada removida.')
        else:
            print('ID não encontrado.')
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
