import "./App.css";
import { useEffect, useRef, useState } from "react";
import BarcodeDetector from "barcode-detector";

function App() {
  const video = useRef();
  const canvas = useRef();
  const [barcode, setbarcode] = useState([]);
  const openCam = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720 } })
      .then((stream) => {
        video.current.srcObject = stream;
        video.current.play();

        const ctx = canvas.current.getContext("2d");
        const barcodeDetector = new BarcodeDetector({
          formats: ["qr_code", "ean_13"],
        });
        setInterval(() => {
          canvas.current.width = video.current.videoWidth;
          canvas.current.height = video.current.videoHeight;
          ctx.drawImage(
            video.current,
            0,
            0,
            video.current.videoWidth,
            video.current.videoHeight
          );
          barcodeDetector
            .detect(canvas.current)
            .then(([data]) => {
              if (data) {
                setbarcode(data.rawValue);
              }
            })
            .catch((err) => console.log(err));
        }, 100);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {}, [barcode]);

  return (
    <>
      <button onClick={openCam}>Kamerayı Aç</button>
      <div>
        <video ref={video} autoPlay muted hidden />
        <canvas ref={canvas} />
      </div>
      {barcode && <div>bulunan barkod :{barcode}</div>}
    </>
  );
}

export default App;
