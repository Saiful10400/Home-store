import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserMultiFormatOneDReader } from "@zxing/browser";
import beepAudio from "../asset/beep.mp3";
import axios from "axios";

const SearchWithBarCodeUi = () => {
  const [message, setMessage] = useState("");
  const [wait, setWait] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  const playBeep = () => {
    const audio = new Audio(beepAudio);
    audio.play();
  };

  useEffect(() => {
    let codeReader: BrowserMultiFormatOneDReader | null = null;
    let stream: MediaStream | null = null;

    const manageSearchedProduct = async (barCode: string) => {
      setWait(true);
      try {
        const res = await axios.get(
          `https://home-store-backend.vercel.app/api/shop/find-product?barCode=${barCode}`
        );

        setWait(false);

        if (res.data?.statusCode === 200) {
          if (res.data.data) {
            navigate("/product/" + res.data.data._id);
          } else {
            setMessage("কোন পণ্য পাওয়া যায়নি");
          }
        }
      } catch (err) {
        setWait(false);
        console.error(err);
      }
    };

    const startScanner = async () => {
      try {
        // 1️⃣ Create a 1D barcode reader
        codeReader = new BrowserMultiFormatOneDReader();

        // 2️⃣ Get all video devices
        const devices = await BrowserMultiFormatOneDReader.listVideoInputDevices();
        const backCameras = devices.filter((d) =>
          d.label.toLowerCase().includes("back")
        );
        const selectedCamera =
          backCameras.length > 0 ? backCameras[backCameras.length - 1] : devices[0];

        // 3️⃣ Get high-res camera stream
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: selectedCamera.deviceId },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.style.display = "block";
          await videoRef.current.play();
          setWait(true);
        }

        // 4️⃣ Apply zoom if supported
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities() as MediaTrackCapabilities & {
          zoom?: { min: number; max: number };
        };
        if (capabilities.zoom) {
          const zoomLevel = Math.min(2, capabilities.zoom.max);
          await track.applyConstraints({ advanced: [{ zoom: zoomLevel }] });
        }

        // 5️⃣ Start continuous scanning
        codeReader.decodeFromVideoElement(videoRef.current!, (result, err) => {
          if (result) {
            playBeep();
            manageSearchedProduct(result.getText());
          }
          // Ignore NotFoundException, it’s normal during live scanning
          if(err) console.error(err);
        });
      } catch (err) {
        console.error("Camera/Scanner error:", err);
      }
    };

    startScanner();

    return () => {
      // Stop scanning & cleanup
      if (codeReader) {
    //   
      }
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [navigate]);

  return (
    <div>
      <p className="text-red-600 font-semibold text-center">{message}</p>
      <video
        ref={videoRef}
        className="w-full max-w-md rounded-lg shadow-md"
        playsInline
      />
      {wait && <p className="mt-2 text-green-600 font-semibold">Loading...</p>}
    </div>
  );
};

export default SearchWithBarCodeUi;
