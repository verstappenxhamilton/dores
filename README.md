# Agoravai Pain Tracker

Um pequeno aplicativo de linha de comando para registrar crises de dor crônica e exibir uma linha do tempo das ocorrências.

O script possui dois subcomandos:
`adicionar` para registrar um novo episódio e `linha_do_tempo` para listar as entradas registradas.

## Uso

Adicione uma nova entrada com nível de dor e descrição:

```bash
python pain_tracker.py adicionar <nivel_de_dor> "descrição da dor" [--timestamp YYYY-MM-DDTHH:MM]
```
O parâmetro `--timestamp` é opcional e deve estar no formato ISO 8601.

Visualize a linha do tempo das ocorrências:

```bash
python pain_tracker.py linha_do_tempo
```

As entradas são armazenadas no arquivo `pain_data.json` na raiz do projeto.

