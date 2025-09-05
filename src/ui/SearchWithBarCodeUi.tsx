import { BrowserMultiFormatReader } from "@zxing/browser";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

import beepAudio from "../asset/beep.mp3"
import { useNavigate } from "react-router-dom";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";


const SearchWithBarCodeUi = () => {

    const [message, setMessage] = useState("")
    const [wait, setWait] = useState(false)
    const updateBarcodeVideoRef = useRef<HTMLVideoElement>(null)
    const move = useNavigate()

    const playBeep = () => {
        const audio = new Audio(beepAudio)
        audio.play()
    }



    interface ZXingReaderWithReset extends BrowserMultiFormatReader {
        reset(): void;
    }

    interface ExtendedMediaTrackConstraints extends MediaTrackConstraints {
        zoom?: number;
    }


    useEffect(() => {
        const manageSearchedProduct = (barCode: string) => {
            axios.get("https://home-store-backend.vercel.app/api/shop/find-product?barCode=" + barCode).then((res) => {
                if (res.data?.statusCode === 200) {
                    setWait(false);
                    if (res.data.data) {
                        move("/product/" + res.data.data._id)
                    } else {
                        setMessage("কোন পণ্য পাওয়া যায়নি")
                    }

                    console.log(res.data.data);


                }
            });
        }

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

        if (updateBarcodeVideoRef.current) {


            BrowserMultiFormatReader
                .listVideoInputDevices()
                .then((videoInputDevices) => {

                    const backCameras = videoInputDevices.filter((d) =>
                        d.label.toLowerCase().includes("back")
                    );


                    const selectedCamera = backCameras.length > 0 ? backCameras[backCameras.length - 1] : videoInputDevices[0];



                    // let's manupulate the video stream
                    (async () => {
                        let stream: MediaStream | null = null
                        stream = await navigator.mediaDevices.getUserMedia(
                            {
                                video: {
                                    deviceId: { exact: selectedCamera.deviceId },
                                    width: { ideal: 1920 },
                                    height: { ideal: 1080 }
                                }
                            }
                        )

                        if (updateBarcodeVideoRef.current && stream) {
                            updateBarcodeVideoRef.current.srcObject = stream
                            updateBarcodeVideoRef.current.style.display = "block"
                            await updateBarcodeVideoRef.current.play()
                            setWait(true)
                        }



                        // let's zoom the video 2x if possible.
                        const track = stream.getVideoTracks()[0];
                        const capabilities = track.getCapabilities() as MediaTrackCapabilities & { zoom?: { max: number, min: number } };
                        if (capabilities?.zoom) {
                            const zoomLevel = Math.min(2, capabilities.zoom.max)
                            await track.applyConstraints({ advanced: [{ zoom: zoomLevel }] as ExtendedMediaTrackConstraints[] })
                        }

                    })()
 

                    codeReader.decodeFromVideoElement(
                        updateBarcodeVideoRef.current!, (result, err) => {
                            if (result && updateBarcodeVideoRef.current) {
                                (codeReader as ZXingReaderWithReset).reset()
                                updateBarcodeVideoRef.current.style.display = "none"
                                playBeep()
                                manageSearchedProduct(result.getText())

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
        return () => {
            // (codeReader as ZXingReaderWithReset).reset()
        }

    }, [move])





    return (
        <div>
            <p className="text-red-600 font-semibold text-center">{message}</p>
            <video ref={updateBarcodeVideoRef} className="w-full max-w-md rounded-lg shadow-md" />
            {wait && (
                <p className="mt-2 text-green-600 font-semibold">{wait ? "Loading..." : null}</p>
            )}
        </div>
    );
};

export default SearchWithBarCodeUi;