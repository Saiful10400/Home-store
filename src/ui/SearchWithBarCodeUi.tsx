import { BarcodeFormat, BrowserMultiFormatReader, DecodeHintType } from "@zxing/library";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

import beepAudio from "../asset/beep.mp3"
import { useNavigate } from "react-router-dom";


const SearchWithBarCodeUi = () => {

    const [message, setMessage] = useState("")
    const [wait, setWait] = useState(false)
    const updateBarcodeVideoRef = useRef<HTMLVideoElement>(null)
    const move = useNavigate()

    const playBeep = () => {
        const audio = new Audio(beepAudio)
        audio.play()
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

            codeReader
                .listVideoInputDevices()
                .then((videoInputDevices) => {

                    const backCameras = videoInputDevices.filter((d) =>
                        d.label.toLowerCase().includes("back")
                    );


                    const selectedCamera = backCameras.length > 0 ? backCameras[backCameras.length - 1] : videoInputDevices[0];

                    codeReader.decodeFromVideoDevice(selectedCamera.deviceId, updateBarcodeVideoRef.current!, (result, err) => {
                        if (result && updateBarcodeVideoRef.current) {
                            codeReader.reset()
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
            codeReader.reset()
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