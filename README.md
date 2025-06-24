# Agoravai Pain Tracker

Um pequeno aplicativo de linha de comando para registrar crises de dor crônica e exibir uma linha do tempo das ocorrências.

O script possui três subcomandos:
`adicionar` para registrar um novo episódio,
`linha_do_tempo` para listar as entradas registradas,
`remover` para apagar um item pelo ID e
`estatisticas` para ver média e total de ocorrências.

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

Veja estatísticas gerais:

```bash
python pain_tracker.py estatisticas
```

As entradas são armazenadas no arquivo `pain_data.json` na raiz do projeto. O
código responsável por ler e gravar esse arquivo está em `storage.py`, sendo
compartilhado pelo modo de linha de comando e pelo servidor web.


## Modo web

Rode um pequeno servidor HTTP e acesse o aplicativo pelo navegador.

```bash
python server.py
```

Abra `http://localhost:8000` no navegador para adicionar novas entradas e ver a linha do tempo. Cada item possui um botão "Remover" para exclusão e a página exibe estatísticas com o total de registros e níveis médio e máximo.
O formulário na página permite informar opcionalmente a data e hora do evento.

## Deploy no Render

Este projeto inclui um `render.yaml` para facilitar a criação de um Web Service
no [Render](https://render.com). Escolha "Web Service" e não "Static Site" ao
conectar o repositório. Não há etapa de build; o Render apenas instala o
`requirements.txt` e executa `python server.py`.
