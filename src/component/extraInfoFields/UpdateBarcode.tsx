import { Barcode } from "lucide-react";
import { useState } from "react";
import UpdateBarcodeUi from "../../ui/UpdateBarcodeUi";


const UpdateBarcode = ({id}:{id:string}) => {
    const [clicked, setClicked] = useState(false);
    console.log(clicked)

    if (clicked) {
        return <UpdateBarcodeUi id={id} />
    }
    else {
        return (<div>
            <button onClick={() => setClicked(true)}><Barcode className="border border-black rounded-md " width={40} height={40} /></button>
        </div>)
    }
};

export default UpdateBarcode;