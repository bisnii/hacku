import cv2
import numpy as np


def compute_pos_face_eyes(img):
    if img is None:
        raise Exception('引数：imgがありません')

    face_cascade = cv2.CascadeClassifier('modules/haarcascade_frontalface_default.xml')
    eye_cascade = cv2.CascadeClassifier('modules/haarcascade_eye.xml')
    if face_cascade.empty(): 
        raise IOError('Unable to load the face cascade classifier xml file') 
    if eye_cascade.empty(): 
        raise IOError('Unable to load the eye cascade classifier xml file') 
    
    # 以下の処理はフロントから画像が送信されてくるときは変更する必要あり
    # OpenCVはRGBではなくBGRなのに注意
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    face_rects = face_cascade.detectMultiScale(gray, 1.1, 3)  # 検出されない場合空のタプル()が返却される
    eye_rects = ()
    for xf,yf,wf,hf in face_rects: 
        roi = gray[yf:yf+hf, xf:xf+wf]
        eye_rects = eye_cascade.detectMultiScale(roi)
    return face_rects, eye_rects

def check_status(img):
    return compute_pos_face_eyes(img)


# 下はテスト用に書いてるだけ
if __name__ == '__main__':
    img = cv2.imread('./data/image1.png')
    print(check_status(img))