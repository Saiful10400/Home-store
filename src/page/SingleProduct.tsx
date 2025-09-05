import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { tProducts } from "../types";
import { Eye, Trash } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import BarCodeScannerComponent from "../component/Shared/BarCodeScannerComponent";
import UpdateBarcode from "../component/extraInfoFields/UpdateBarcode";
import UpdateStock from "../component/extraInfoFields/UpdateStock";
import UpdateExpireDate from "../component/extraInfoFields/UpdateExpireDate";

const SingleProduct = () => {
  const [refetch, setRefetch] = useState(false);
  const { id } = useParams();
  const [products, setProducts] = useState<tProducts | null>(null);
  const navigate = useNavigate();
  const [showBuyPrice, setShowBuyPrice] = useState(false);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    axios
      .get(`https://home-store-backend.vercel.app/api/shop/find-product?id=${id}`)
      .then((res) => setProducts(res.data.data));
  }, [id, refetch]);

  const deleteHandle = (id: string) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই পণ্যটি ডিলিট করলে এটি পুনরায় ফিরানো যাবে না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "বাতিল",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://home-store-backend.vercel.app/api/shop/delete-product/${id}`)
          .then((res) => {
            if (res.data.statusCode === 200) {
              toast.success("ডিলিট হয়েছে।");
              navigate("/");
            }
          })
          .catch((err) => {
            toast.error("ডিলিট করা যায়নি। আবার চেষ্টা করুন।");
            console.error(err);
          });
      }
    });
  };

  const formHandle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWaiting(true);
    const form = e.currentTarget;
    const data: Partial<tProducts> = {
      banglaName: form.banglaName.value,
      englishName: form.englishName.value,
      buyingPrice: form.buyingPrice.value,
      sellingPrice: form.sellingPrice.value,
    };
    axios
      .put(
        `https://home-store-backend.vercel.app/api/shop/update-product/${products?._id}`,
        data
      )
      .then((res) => {
        setWaiting(false);
        if (res.data?.statusCode === 200) {
          Swal.fire({
            title: "আপডেট হয়েছে",
            icon: "success",
            draggable: true,
          });
          setRefetch((p) => !p);
        }
      });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      {/* Product Image */}
      <div className="w-full rounded-xl overflow-hidden shadow-lg">
        <img
          src={products?.image}
          alt={products?.banglaName}
          className="w-full object-cover max-h-96"
        />
      </div>

      {/* Product Info Card */}
      <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
        <h2 className="text-2xl font-bold">{products?.banglaName}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">ইংরেজি নাম</span>
            <span>{products?.englishName}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">ক্রয় মূল্য</span>
            <span>
              {showBuyPrice ? (
                `${products?.buyingPrice} /=`
              ) : (
                <button
                  onClick={() => setShowBuyPrice(true)}
                  className="text-green-600 hover:text-green-800"
                >
                  <Eye />
                </button>
              )}
            </span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">বিক্রয় মূল্য</span>
            <span>{products?.sellingPrice} /=</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">Bar Code</span>
            <span>{products?.barCode || "n/a"}</span>
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => deleteHandle(products?._id as string)}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
        >
          <Trash />
          Delete Product
        </button>
      </div>

      {/* Update Form */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Update Product Info</h2>
        <form onSubmit={formHandle} className="flex flex-col gap-4 max-w-md mx-auto">
          <input
            required
            name="englishName"
            type="text"
            placeholder="ইংরেজি নাম"
            defaultValue={products?.englishName}
            className="border-2 border-gray-300 rounded-lg py-2 px-3 focus:outline-green-500"
          />
          <input
            required
            name="banglaName"
            type="text"
            placeholder="বাংলা নাম"
            defaultValue={products?.banglaName}
            className="border-2 border-gray-300 rounded-lg py-2 px-3 focus:outline-green-500"
          />
          <input
            required
            name="buyingPrice"
            type="password"
            placeholder="ক্রয় মূল্য"
            defaultValue={products?.buyingPrice}
            className="border-2 border-gray-300 rounded-lg py-2 px-3 focus:outline-green-500"
          />
          <input
            required
            name="sellingPrice"
            type="text"
            placeholder="বিক্রয় মূল্য"
            defaultValue={products?.sellingPrice}
            className="border-2 border-gray-300 rounded-lg py-2 px-3 focus:outline-green-500"
          />
          <button
            disabled={waiting}
            className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold text-lg transition"
          >
            {waiting ? "অপেক্ষা করুন" : "Update"}
          </button>
        </form>
      </div>

      {/* Extra Info Section */}
      {(!products?.barCode || !products?.stock || !products?.expiredDate) && (
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-bold text-center mb-4">অতিরিক্ত তথ্য</h2>
          <div className="flex flex-col md:flex-row justify-evenly gap-4">
            {!products?.barCode && <UpdateBarcode id={products?._id as string} />}
            {!products?.stock && <UpdateStock />}
            {!products?.expiredDate && <UpdateExpireDate />}
          </div>
        </div>
      )}

      {/* Barcode Scanner */}
      <BarCodeScannerComponent />
    </div>
  );
};

export default SingleProduct;
