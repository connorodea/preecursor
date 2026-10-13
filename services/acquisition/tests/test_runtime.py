"""Smoke the deployed WSGI server, without contacting external providers."""
import importlib.util
import json
import os
import socket
import subprocess
import sys
import tempfile
import time
import unittest
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from services.acquisition.config import Config
from services.acquisition.core import Store


@unittest.skipUnless(importlib.util.find_spec('gunicorn'), 'Install requirements.txt for production server smoke test')
class GunicornTests(unittest.TestCase):
    def test_health_and_fail_closed_intake(self):
        with tempfile.TemporaryDirectory() as directory:
            database = str(Path(directory) / 'runtime.sqlite3')
            Store(Config(database=database, token_secret='s' * 40)).initialize()
            with socket.socket() as sock:
                sock.bind(('127.0.0.1', 0))
                port = sock.getsockname()[1]
            environment = {key: value for key, value in os.environ.items() if not key.startswith('ACQ_')}
            environment.update(ACQ_DATABASE=database, ACQ_TOKEN_SECRET='s' * 40,
                               ACQ_TURNSTILE_SECRET='synthetic-no-network', PYTHONDONTWRITEBYTECODE='1')
            process = subprocess.Popen([sys.executable, '-m', 'gunicorn', '--bind', f'127.0.0.1:{port}',
                                        '--workers', '2', '--worker-class', 'sync', 'services.acquisition.app:create_app()'],
                                       env=environment, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
            try:
                deadline = time.monotonic() + 10
                while True:
                    try:
                        with urlopen(f'http://127.0.0.1:{port}/health', timeout=1) as response:
                            self.assertEqual(json.load(response), {'ok': True})
                        break
                    except (URLError, TimeoutError):
                        if process.poll() is not None or time.monotonic() > deadline:
                            self.fail('Gunicorn did not become ready')
                        time.sleep(0.05)
                request = Request(f'http://127.0.0.1:{port}/leads', data=b'{}',
                                  headers={'Origin': 'https://preecursor.com', 'Content-Type': 'application/json'})
                with self.assertRaises(HTTPError) as error:
                    urlopen(request, timeout=2)
                self.assertEqual(error.exception.code, 400)
                error.exception.close()
            finally:
                process.terminate()
                try:
                    process.communicate(timeout=5)
                except subprocess.TimeoutExpired:
                    process.kill(); process.communicate()
