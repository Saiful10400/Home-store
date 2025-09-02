import { BarcodeFormat, BrowserMultiFormatReader, DecodeHintType } from "@zxing/library";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import beepAudio from "../asset/beep.mp3"


const UpdateBarcodeUi = ({ id }: { id: string }) => {


    const [wait, setWait] = useState(false)
    const updateBarcodeVideoRef = useRef<HTMLVideoElement>(null)


    const playBeep = () => {
        const audio = new Audio(beepAudio)
        audio.play()
    }



    useEffect(() => {

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

            codeReader
                .listVideoInputDevices()
                .then((videoInputDevices) => {

                    const backCameras = videoInputDevices.filter((d) =>
                        d.label.toLowerCase().includes("back")
                    );


                    const selectedCamera = backCameras.length > 0 ? backCameras[backCameras.length - 1] : videoInputDevices[0];

                    codeReader.decodeFromVideoDevice(selectedCamera.deviceId, updateBarcodeVideoRef.current!, (result, err) => {
                        if (result && updateBarcodeVideoRef.current) {
                            playBeep()
                            codeReader.reset()
                            updateBarcodeVideoRef.current.style.display = "none"
                            axios.put("https://home-store-backend.vercel.app/api/shop/update-product/" + id, { barCode: result.getText() }).then((res) => {
                                if (res.data?.statusCode === 200) {
                                    setWait(false);
                                    Swal.fire({
                                        title: "আপডেট হয়েছে",
                                        icon: "success",
                                        draggable: true,
                                    });


                                }
                            });

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
            codeReader.reset()
        }

    }, [id])





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