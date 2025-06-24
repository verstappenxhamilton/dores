"""Funções utilitárias para persistência das entradas de dor."""

import json
import os
from datetime import datetime
import uuid
from pathlib import Path

#: Caminho padrão do arquivo de dados. Pode ser alterado definindo a
#: variável de ambiente ``PAIN_DATA_FILE``.
DATA_FILE = Path(os.environ.get("PAIN_DATA_FILE", "pain_data.json"))


def load_data():
    """Carrega as entradas do disco e garante que todas possuam um ID."""
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
    """Grava a lista de entradas no arquivo configurado."""
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def add_entry(level, description, timestamp=None):
    """Adiciona uma nova ocorrência e a retorna."""
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
    """Remove uma entrada pelo ID. Retorna ``True`` se removida."""
    data = load_data()
    new_data = [e for e in data if e.get('id') != entry_id]
    if len(new_data) == len(data):
        return False
    save_data(new_data)
    return True


def compute_stats():
    """Calcula estatísticas gerais das ocorrências armazenadas."""
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
