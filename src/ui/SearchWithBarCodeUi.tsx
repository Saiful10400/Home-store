import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserMultiFormatOneDReader } from "@zxing/browser";
import beepAudio from "../asset/beep.mp3";
import axios from "axios";
import { X } from "lucide-react";

interface ExtendedMediaTrackConstraints extends MediaTrackConstraints {
  zoom?: number;
  focusMode?: string;
}

interface Props {
  onClose?: () => void;
}

const SearchWithBarCodeUi = ({ onClose }: Props) => {
  const [message, setMessage] = useState("");
  const [wait, setWait] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  const playBeep = () => {
    const audio = new Audio(beepAudio);
    audio.play();
  };

  useEffect(() => {
    let codeReader: BrowserMultiFormatOneDReader | null = null;
    let stream: MediaStream | null = null;
    let snapshotInterval: ReturnType<typeof setInterval> | null = null;

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
            width: { ideal: 3840 }, // try higher resolution
            height: { ideal: 2160 },
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.style.display = "block";
          await videoRef.current.play();
          setWait(true);
        }

        // Autofocus + zoom if supported
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities() as MediaTrackCapabilities & {
          zoom?: { min: number; max: number };
          focusMode?: string[];
        };

        if (capabilities.focusMode?.includes("continuous")) {
          await track.applyConstraints({
            advanced: [{ focusMode: "continuous" }] as ExtendedMediaTrackConstraints[],
          });
        }

        if (capabilities.zoom) {
          const zoomLevel = Math.min(2, capabilities.zoom.max);
          await track.applyConstraints({
            advanced: [{ zoom: zoomLevel }] as ExtendedMediaTrackConstraints[],
          });
        }

        // Start live decoding
        codeReader.decodeFromVideoElement(videoRef.current!, (result) => {
          if (result) {
            playBeep();
            manageSearchedProduct(result.getText());
          }
        });

        // Fallback: snapshot scanning every 2s
        snapshotInterval = setInterval(async () => {
          if (!canvasRef.current || !videoRef.current) return;
          const ctx = canvasRef.current.getContext("2d");
          if (!ctx) return;

          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
          ctx.drawImage(
            videoRef.current,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );

          try {
            const result = await codeReader!.decodeFromCanvas(canvasRef.current);
            if (result) {
              playBeep();
              manageSearchedProduct(result.getText());
              if (snapshotInterval) clearInterval(snapshotInterval);
            }
          } catch {
            // ignore NotFound errors
          }
        }, 2000);
      } catch (err) {
        console.error("Camera/Scanner error:", err);
      }
    };

    startScanner();

    return () => {
      if (snapshotInterval) clearInterval(snapshotInterval);
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
        <div className="relative w-full">
          <video
            ref={videoRef}
            className="w-full rounded-xl shadow-md border-2 border-gray-300"
            playsInline
          />
          {/* Overlay scan box */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-24 border-4 border-green-500 rounded-md"></div>
          </div>
        </div>

        {/* Hidden canvas for snapshot fallback */}
        <canvas ref={canvasRef} className="hidden" />

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
