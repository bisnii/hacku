from flask import Flask, request, redirect, render_template, make_response, jsonify
import json

import doze_detection

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

# @app.route('/get_status', methods=['POST'])
# def get_status():
#     img = request.files[]
#     status = doze_detection.check_status(img)
#     return jsonify({'status': status})


if __name__ == '__main__':
    app.run(debug=True)