import { Barcode, X } from "lucide-react";
import { useState } from "react";
import SearchWithBarCodeUi from "../../ui/SearchWithBarCodeUi";

const SearchWithBarCode = () => {
  const [clicked, setClicked] = useState(false);

  return (
    <>
      {/* Barcode Button */}
      {!clicked && (
        <button
          onClick={() => setClicked(true)}
          className="fixed bottom-10 right-10 bg-green-600 p-4 rounded-full text-white z-50 shadow-lg hover:bg-green-700 transition"
        >
          <Barcode />
        </button>
      )}

      {/* Barcode Modal / Overlay */}
      {clicked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-xl relative w-full max-w-md shadow-lg">
            {/* Close Button */}
            <button
              onClick={() => setClicked(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X />
            </button>

            {/* Actual Barcode Search UI */}
            <SearchWithBarCodeUi />
          </div>
        </div>
      )}
    </>
  );
};

export default SearchWithBarCode;
