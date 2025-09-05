
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import beepAudio from "../asset/beep.mp3"
import { BrowserMultiFormatOneDReader } from "@zxing/browser";
interface ExtendedMediaTrackConstraints extends MediaTrackConstraints { zoom?: number; }

const UpdateBarcodeUi = ({ id }: { id: string }) => {

    const [cleanup, setclieanup] = useState(false)
    const [wait, setWait] = useState(false)
    const updateBarcodeVideoRef = useRef<HTMLVideoElement>(null)


    const playBeep = () => {
        const audio = new Audio(beepAudio);
        audio.play();
    };


    useEffect(() => {
        let codeReader: BrowserMultiFormatOneDReader | null = null;
        let stream: MediaStream | null = null;

        const updateProductBarcode = async (barCode: string) => {
            setWait(true);
            try {
                axios.put("https://home-store-backend.vercel.app/api/shop/update-product/" + id, { barCode: barCode }).then((res) => {
                    if (res.data?.statusCode === 200) {
                        setWait(false);
                        setclieanup(true)
                        if (stream) {
                            stream.getTracks().forEach((t) => t.stop());
                        }
                        Swal.fire({
                            title: "আপডেট হয়েছে",
                            icon: "success",
                            draggable: true,
                        }).then(()=>{
                            window.location.reload();
                        })


                    }
                });
            } catch (err) {
                setWait(false);
                console.error(err);
            }
        };

        const startScanner = async () => {
            try {
                // 1️⃣ Create a 1D barcode reader
                codeReader = new BrowserMultiFormatOneDReader()

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

                if (updateBarcodeVideoRef.current) {
                    updateBarcodeVideoRef.current.srcObject = stream;
                    updateBarcodeVideoRef.current.style.display = "block";
                    await updateBarcodeVideoRef.current.play();
                    setWait(true);
                }

                // 4️⃣ Apply zoom if supported
                const track = stream.getVideoTracks()[0];
                const capabilities = track.getCapabilities() as MediaTrackCapabilities & {
                    zoom?: { min: number; max: number };
                };
                if (capabilities.zoom) {
                    const zoomLevel = Math.min(2, capabilities.zoom.max);
                    await track.applyConstraints({ advanced: [{ zoom: zoomLevel }] as ExtendedMediaTrackConstraints[] });
                }

                // 5️⃣ Start continuous scanning
                codeReader.decodeFromVideoElement(updateBarcodeVideoRef.current!, (result) => {
                    if (result&& !cleanup) {
                        playBeep();
                        updateProductBarcode(result.getText());
                    }
                    // Ignore NotFoundException, it’s normal during live scanning
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);




    return (
        <div>
            <video ref={updateBarcodeVideoRef} className="w-full max-w-md rounded-lg shadow-md" />
            {wait && (
                <p className="mt-2 text-green-600 font-semibold">{wait ? "Loading..." : null}</p>
            )}
        </div>
    );
};

export default UpdateBarcodeUi;