import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserMultiFormatOneDReader } from "@zxing/browser";
import beepAudio from "../asset/beep.mp3";
import axios from "axios";
import { X } from "lucide-react";

interface ExtendedMediaTrackConstraints extends MediaTrackConstraints {
  zoom?: number;
}

interface Props {
  onClose?: () => void;
}

const SearchWithBarCodeUi = ({ onClose }: Props) => {
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
        setMessage("ক্যামেরা বা সার্ভার সমস্যা হয়েছে");
      }
    };

    const startScanner = async () => {
      try {
        codeReader = new BrowserMultiFormatOneDReader();
        const devices = await BrowserMultiFormatOneDReader.listVideoInputDevices();
        const backCameras = devices.filter((d) =>
          d.label.toLowerCase().includes("back")
        );
        const selectedCamera =
          backCameras.length > 0 ? backCameras[backCameras.length - 1] : devices[0];

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

        // Zoom if supported
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities() as MediaTrackCapabilities & {
          zoom?: { min: number; max: number };
        };
        if (capabilities.zoom) {
          const zoomLevel = Math.min(2, capabilities.zoom.max);
          await track.applyConstraints({
            advanced: [{ zoom: zoomLevel }] as ExtendedMediaTrackConstraints[],
          });
        }

        codeReader.decodeFromVideoElement(videoRef.current!, (result) => {
          if (result) {
            playBeep();
            manageSearchedProduct(result.getText());
          }
        });
      } catch (err) {
        console.error("Camera/Scanner error:", err);
        
      }
    };

    startScanner();

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full relative p-4 flex flex-col items-center">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        {/* Scanner Video */}
        <video
          ref={videoRef}
          className="w-full rounded-xl shadow-md border-2 border-gray-300"
          playsInline
        />

        {/* Messages */}
        {message && (
          <p className="mt-4 text-center text-red-600 font-semibold">{message}</p>
        )}

        {/* Loading */}
        {wait && (
          <p className="mt-2 text-green-600 font-medium animate-pulse">
            Scanning...
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchWithBarCodeUi;
