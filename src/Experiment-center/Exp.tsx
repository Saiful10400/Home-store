import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";


const Exp = () => {

    const videoRef = useRef<HTMLVideoElement>(null)

    const [result, setResult] = useState("")


    const codeReader = new BrowserMultiFormatReader()
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.style.display = "none"
        }
        return () => {
            codeReader.reset()
        }

    }, [])


    const startScanner = () => {
        if (videoRef.current) {
            videoRef.current.style.display = "block"
        }
        if (videoRef.current) {




            codeReader
                .listVideoInputDevices()
                .then((videoInputDevices) => {
                    const selectedDeviceId = videoInputDevices.find(device => device.label.toLowerCase().includes('back'))?.deviceId || videoInputDevices[0].deviceId;
                    codeReader.decodeFromVideoDevice(selectedDeviceId, videoRef.current!, (result, err) => {
                        if (result) {
                            setResult(result.getText());
                            codeReader.reset(); // Stop scanning after a successful scan
                        }
                        if (err) {
                            // console.error(err);
                        }
                    });
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }


    return (
        <div className="p-4">
            <video ref={videoRef} className="w-full max-w-md rounded-lg shadow-md" />
            <button
                onClick={startScanner}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Start Scanner
            </button>
            {result && (
                <p className="mt-2 text-green-600 font-semibold">Scanned: {result}</p>
            )}
        </div>
    );
};

export default Exp;