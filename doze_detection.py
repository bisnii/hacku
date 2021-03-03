import cv2
import numpy as np


def compute_pos_faces_eyes(img):
    if img is None:
        raise Exception('引数：imgがありません')

    face_cascade = cv2.CascadeClassifier('modules/haarcascade_frontalface_default.xml')
    eye_cascade = cv2.CascadeClassifier('modules/haarcascade_eye.xml')
    if face_cascade.empty(): 
        raise IOError('Unable to load the face cascade classifier xml file') 
    if eye_cascade.empty(): 
        raise IOError('Unable to load the eye cascade classifier xml file') 
    
    # OpenCVはBGR、フロントから送信されてくる画像がRGBの場合変更する
    # gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    face_rects = face_cascade.detectMultiScale(gray, minNeighbors=2)  # 検出されない場合空のタプル()が返却される
    eye_rects = []
    for xf,yf,wf,hf in face_rects:
        roi = gray[yf:yf+hf, xf:xf+wf]
        eye_rect = eye_cascade.detectMultiScale(roi, minNeighbors=10)
        if eye_rect == ():
            continue

        # roi画像の座標から全体画像の座標にする
        eye_rect += np.array((xf,yf,0,0))
        eye_rects.append(eye_rect)

    if eye_rects == []:
        eye_rects = ()
    else:
        eye_rects = np.concatenate(eye_rects)
    return face_rects, eye_rects

def check_status(img):
    return compute_pos_faces_eyes(img)

# 以下テスト用プログラム
if __name__ == '__main__':
    # 動画でテストする場合
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print('Camera is not opened')  # カメラが起動しない場合、VideoCaptureの引数を0~9で変えてみる
    else:
        while True:
            ret, img = cap.read()
            face_rects, eye_rects = compute_pos_faces_eyes(img)
            print('face_rects :\n', face_rects)
            print('eye_rects :\n', eye_rects)
            for x, y, w, h in face_rects:
                cv2.rectangle(img, (x,y), (x+w,y+h), (0,0,255), 3)
            for x, y, w, h in eye_rects:
                cv2.rectangle(img, (x,y), (x+w,y+h), (0,255,0), 3)
            cv2.imshow('video capture : Press "q", if you want to finish.', img)
            key = cv2.waitKey(1)
            if key & 0xFF == ord('q'):
                break
    cap.release()
    cv2.destroyAllWindows()

    # 画像でテストする場合
    # img = cv2.imread('./data/image1.png')
    # face_rects, eye_rects = compute_pos_faces_eyes(img)
    # print('face_rects :\n', face_rects)
    # print('eye_rects :\n', eye_rects)
    # for x, y, w, h in face_rects:
    #     cv2.rectangle(img, (x,y), (x+w,y+h), (0,0,255), 3)
    # for x, y, w, h in eye_rects:
    #     cv2.rectangle(img, (x,y), (x+w,y+h), (0,255,0), 3)
    # cv2.imshow('test', img)
    # cv2.waitKey()  # 何かキーを押したら終了、右上のXで終了しない
    # cv2.destroyAllWindows()