from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello():
    print("aaaaaaaaaaaaaaaaa")
    return "Hello World"

if __name__=="__main__":
    app.run(debug=True, host="192.168.0.206", port="80")