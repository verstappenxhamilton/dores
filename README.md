# Agoravai Pain Tracker

Um pequeno aplicativo de linha de comando para registrar crises de dor crônica e exibir uma linha do tempo das ocorrências.

O script possui três subcomandos:
`adicionar` para registrar um novo episódio,
`linha_do_tempo` para listar as entradas registradas e
`remover` para apagar um item pelo ID.

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

Para remover uma entrada informe o ID mostrado na linha do tempo:

```bash
python pain_tracker.py remover <id_da_entrada>
```

As entradas são armazenadas no arquivo `pain_data.json` na raiz do projeto. O
código responsável por ler e gravar esse arquivo está em `storage.py`, sendo
compartilhado pelo modo de linha de comando e pelo servidor web.


## Modo web

Rode um pequeno servidor HTTP e acesse o aplicativo pelo navegador.

```bash
python server.py
```

Abra `http://localhost:8000` no navegador para adicionar novas entradas e ver a linha do tempo. Cada item possui um botão "Remover" para exclusão.
O formulário na página permite informar opcionalmente a data e hora do evento.
