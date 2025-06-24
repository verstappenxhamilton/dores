import json
from http.server import SimpleHTTPRequestHandler, HTTPServer

from storage import load_data, add_entry, remove_entry

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
            level = entry.get('level')
            description = entry.get('description')
            timestamp = entry.get('timestamp')
            if level is None or description is None:
                self.send_error(400, 'Missing level or description')
                return
            try:
                level = int(level)
            except (TypeError, ValueError):
                self.send_error(400, 'Level must be an integer')
                return
            new_entry = add_entry(level, description, timestamp=timestamp)
            self.send_response(201)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(new_entry).encode('utf-8'))
        else:
            self.send_error(404)

    def do_DELETE(self):
        if self.path.startswith('/api/entries/'):
            entry_id = self.path.rsplit('/', 1)[-1]
            if remove_entry(entry_id):
                self.send_response(204)
                self.end_headers()
            else:
                self.send_error(404, 'ID not found')
        else:
            self.send_error(404)


def run(server_class=HTTPServer, handler_class=PainHandler):
    server = server_class(('0.0.0.0', 8000), handler_class)
    print('Serving on http://0.0.0.0:8000')
    server.serve_forever()


if __name__ == '__main__':
    run()
