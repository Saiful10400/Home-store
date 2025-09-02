import { Barcode } from "lucide-react";
import { useState } from "react";
import SearchWithBarCodeUi from "../../ui/SearchWithBarCodeUi";



const SearchWithBarCode = () => {
    const [clicked, setClicked] = useState(false)
    if (clicked) {
        return <SearchWithBarCodeUi />
    }
    else {
        return (
            <button onClick={() => setClicked(true)} className="fixed bottom-10 right-10 bg-green-600 p-4 rounded-full text-white z-50">
                <Barcode />
            </button>
        )
    }
};

export default SearchWithBarCode;