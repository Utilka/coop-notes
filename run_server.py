from gevent.pywsgi import WSGIServer
from start_flask import app

SERVER_PORT = 5050

http_server = WSGIServer(('', SERVER_PORT), app)
http_server.serve_forever()