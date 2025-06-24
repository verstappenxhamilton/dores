# Agoravai Pain Tracker

Um pequeno aplicativo de linha de comando para registrar crises de dor crônica e exibir uma linha do tempo das ocorrências.

## Uso

Adicione uma nova entrada com nível de dor e descrição:

```bash
python pain_tracker.py adicionar <nivel_de_dor> "descrição da dor"
```

Visualize a linha do tempo das ocorrências:

```bash
python pain_tracker.py linha_do_tempo
```

As entradas são armazenadas no arquivo `pain_data.json` na raiz do projeto.

