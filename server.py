import json
from http.server import SimpleHTTPRequestHandler, HTTPServer
from datetime import datetime

from storage import load_data, save_data

class PainHandler(SimpleHTTPRequestHandler):

    def do_GET(self):
        if self.path == '/api/entries':
            data = load_data()
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
            data = load_data()
            entry.setdefault('timestamp', datetime.now().isoformat())
            data.append(entry)
            data.sort(key=lambda x: x['timestamp'])
            save_data(data)
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
