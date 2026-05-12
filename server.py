#!/usr/bin/env python3
"""Simple HTTP server with auto-reload on file changes."""

import http.server
import socketserver
import os
import json
from socketserver import ThreadingMixIn

PORT = 8080
WATCH_DIR = os.path.dirname(os.path.abspath(__file__))
WATCH_EXTENSIONS = {'.html', '.css', '.js', '.json'}

last_mtime = {}

def scan_mtimes():
    mtimes = {}
    for root, dirs, files in os.walk(WATCH_DIR):
        for f in files:
            if os.path.splitext(f)[1] in WATCH_EXTENSIONS:
                path = os.path.join(root, f)
                mtimes[path] = os.path.getmtime(path)
    return mtimes

class AutoReloadHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Set correct MIME types for media files
        if self.path.endswith('.mp4'):
            self.send_header('Content-Type', 'video/mp4')
            self.send_header('Accept-Ranges', 'bytes')
        elif self.path.endswith('.gif'):
            self.send_header('Content-Type', 'image/gif')
        elif self.path.endswith('.jpg') or self.path.endswith('.jpeg'):
            self.send_header('Content-Type', 'image/jpeg')
        elif self.path.endswith('.png'):
            self.send_header('Content-Type', 'image/png')
        super().end_headers()

    def do_GET(self):
        if self.path == '/__reload__':
            global last_mtime
            current = scan_mtimes()
            changed = False
            for path, mtime in current.items():
                if path not in last_mtime or last_mtime[path] != mtime:
                    changed = True
                    break
            last_mtime = current
            body = b'reload' if changed else b'ok'
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain')
            self.send_header('Content-Length', str(len(body)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(body)
            return

        # For HTML requests, inject reload script before </body>
        path = self.translate_path(self.path)
        if os.path.isfile(path) and (path.endswith('.html') or (self.path == '/' and os.path.isfile(os.path.join(path, 'index.html')))):
            if self.path == '/':
                path = os.path.join(path, 'index.html')
            try:
                with open(path, 'rb') as f:
                    content = f.read()
                reload_script = (
                    b'<script>'
                    b'(function(){'
                    b'var check=function(){'
                    b'fetch("/__reload__").then(function(r){return r.text()}).then(function(t){'
                    b'if(t==="reload")location.reload();'
                    b'}).catch(function(){});'
                    b'};'
                    b'setInterval(check,1000);'
                    b'})();'
                    b'</script>'
                    b'</body>'
                )
                if b'</body>' in content:
                    content = content.replace(b'</body>', reload_script)
                else:
                    content += reload_script
                
                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Content-Length', str(len(content)))
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(content)
                return
            except Exception:
                pass

        # Handle Range requests for video files
        range_header = self.headers.get('Range')
        if range_header and os.path.isfile(path):
            try:
                file_size = os.path.getsize(path)
                bytes_start = 0
                bytes_end = file_size - 1
                
                range_match = range_header.strip().split('=')[1].split('-')
                if range_match[0]:
                    bytes_start = int(range_match[0])
                if range_match[1]:
                    bytes_end = int(range_match[1])
                
                if bytes_start >= file_size:
                    self.send_response(416)
                    self.send_header('Content-Range', f'bytes */{file_size}')
                    self.end_headers()
                    return
                
                bytes_length = bytes_end - bytes_start + 1
                
                with open(path, 'rb') as f:
                    f.seek(bytes_start)
                    data = f.read(bytes_length)
                
                self.send_response(206)
                self.send_header('Content-Type', 'video/mp4')
                self.send_header('Content-Range', f'bytes {bytes_start}-{bytes_end}/{file_size}')
                self.send_header('Content-Length', str(bytes_length))
                self.send_header('Accept-Ranges', 'bytes')
                self.end_headers()
                self.wfile.write(data)
                return
            except Exception:
                pass

        super().do_GET()

    def do_HEAD(self):
        # Support HEAD requests for video metadata
        super().do_HEAD()

    def log_message(self, format, *args):
        pass

class ThreadedHTTPServer(ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    request_queue_size = 100

def run():
    global last_mtime
    last_mtime = scan_mtimes()
    with ThreadedHTTPServer(("", PORT), AutoReloadHandler) as httpd:
        print(f"Server running at http://localhost:{PORT}")
        print("Auto-reload enabled. Edit any .html/.css/.js/.json file to see changes.")
        httpd.serve_forever()

if __name__ == "__main__":
    run()
