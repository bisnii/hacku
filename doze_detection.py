import cv2


def compute_pos_faces(img):
    if img is None:
        raise Exception('引数：imgがありません')

    face_cascade = cv2.CascadeClassifier('modules/haarcascade_frontalface_default.xml')
    if face_cascade.empty(): 
        raise IOError('Unable to load the face cascade classifier xml file') 
    
    # OpenCVはBGR、フロントから送信されてくる画像がRGBの場合変更する
    # gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    face_rects = face_cascade.detectMultiScale(gray, minNeighbors=4)  # 検出されない場合空のタプル()が返却される
    return face_rects

def check_status(img):
    face_rects = compute_pos_faces(img)
    if len(face_rects) == 0:
        status = 'sleep'
    else:
        status = 'active'
    return status

# 以下テスト用プログラム
if __name__ == '__main__':
    import sys
    if len(sys.argv) == 2:
        arg = sys.argv[1]
    else:
        raise Exception('コマンド引数を入力してください')

    # 動画でテストする場合
    # "q"キーでプログラム終了
    if arg == 'movie':
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print('Camera is not opened')  # カメラが起動しない場合、VideoCaptureの引数を0~9で変えてみる
        else:
            while True:
                ret, img = cap.read()
                face_rects = compute_pos_faces(img)
                for x, y, w, h in face_rects:
                    cv2.rectangle(img, (x,y), (x+w,y+h), (0,0,255), 3)
                cv2.imshow('video capture : Press "q", if you want to finish.', img)
                key = cv2.waitKey(1)
                if key & 0xFF == ord('q'):
                    break
                print('status:', check_status(img))
        cap.release()
        cv2.destroyAllWindows()

    # 画像でテストする場合
    else:
        img = cv2.imread(arg)
        face_rects = compute_pos_faces(img)
        for x, y, w, h in face_rects:
            cv2.rectangle(img, (x,y), (x+w,y+h), (0,0,255), 3)
        cv2.imshow('test', img)
        print('status:', check_status(img))
        cv2.waitKey()  # 何かキーを押したら終了、右上のXで終了しない
        cv2.destroyAllWindows()