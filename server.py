import json
from http.server import SimpleHTTPRequestHandler, HTTPServer
from pathlib import Path
from datetime import datetime

DATA_FILE = Path("pain_data.json")

class PainHandler(SimpleHTTPRequestHandler):
    def _load_data(self):
        if DATA_FILE.exists():
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def _save_data(self, data):
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    def do_GET(self):
        if self.path == '/api/entries':
            data = self._load_data()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(data).encode('utf-8'))
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == '/api/entries':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            try:
                entry = json.loads(body.decode('utf-8'))
            except json.JSONDecodeError:
                self.send_error(400, 'Invalid JSON')
                return
            data = self._load_data()
            entry.setdefault('timestamp', datetime.now().isoformat())
            data.append(entry)
            data.sort(key=lambda x: x['timestamp'])
            self._save_data(data)
            self.send_response(201)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(entry).encode('utf-8'))
        else:
            self.send_error(404)


def run(server_class=HTTPServer, handler_class=PainHandler):
    server = server_class(('0.0.0.0', 8000), handler_class)
    print('Serving on http://0.0.0.0:8000')
    server.serve_forever()


if __name__ == '__main__':
    run()
