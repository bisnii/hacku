import json, base64
from io import BytesIO

from flask import Flask, request, redirect, render_template, make_response, jsonify
import cv2
import numpy as np

import doze_detection


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_status', methods=['POST'])
def get_status():
    enc_data = request.form['img']
    dec_data = base64.b64decode(enc_data.split(',')[1])
    dec_np = np.fromstring(dec_data, np.uint8)
    dec_img = cv2.imdecode(dec_np, cv2.IMREAD_ANYCOLOR)
    status = doze_detection.check_status(dec_img)
    return jsonify({'status': status})

@app.route('/detection_test')
def detection_test():
    return render_template('detection_test.html')

@app.route('/activity_log')
def activity_log():
    return render_template('activity_log.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/typing')
def typing():
    return render_template('typing.html')

if __name__ == '__main__':
    app.run(debug=True)