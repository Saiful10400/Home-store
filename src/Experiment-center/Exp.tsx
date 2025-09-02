import { useEffect, useRef, useState } from "react";
import { BarcodeFormat, BrowserMultiFormatReader, DecodeHintType } from "@zxing/library";


const Exp = () => {

    const videoRef = useRef<HTMLVideoElement>(null)

    const [result, setResult] = useState("")


    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.CODE_128,
        BarcodeFormat.CODE_39,
        BarcodeFormat.EAN_13,
        BarcodeFormat.EAN_8,
        BarcodeFormat.UPC_A,
        BarcodeFormat.UPC_E,
        BarcodeFormat.ITF,
    ]);



    const codeReader = new BrowserMultiFormatReader(hints)

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

                    const backCameras = videoInputDevices.filter((d) =>
                        d.label.toLowerCase().includes("back")
                    );


                    const selectedCamera = backCameras.length > 0 ? backCameras[backCameras.length - 1] : videoInputDevices[0];

                    codeReader.decodeFromVideoDevice(selectedCamera.deviceId, videoRef.current!, (result, err) => {
                        if (result) {
                            setResult(result.getText());

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