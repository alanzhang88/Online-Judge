from flask import Flask
from flask import request
from flask import jsonify
import subprocess

app = Flask(__name__)

tmpFileName = {"C":"Solution.c","C++":"Solution.cpp","Java":"Solution.java","Python2.7":"Solution.py"}

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/exec",methods=["POST"])
def codeExce():
    data = request.get_json()
    #print type(data)
    print "Recv a request to execute the following"
    print str(data["codes"])
    res=""
    langType = str(data["langType"])
    codes = str(data["codes"])
    f = open(tmpFileName[langType],'w')
    f.write(codes)
    f.close()
    res = subprocess.check_output(["./run", langType], stderr=subprocess.STDOUT)

    return jsonify(output=res)


if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0')
