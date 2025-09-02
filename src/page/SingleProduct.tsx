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
  const [refetch, setRefetch] = useState(false)
  const { id } = useParams();
  const [products, setProducts] = useState<tProducts | null>(null);
  const move = useNavigate();
  useEffect(() => {
    axios
      .get(
        "https://home-store-backend.vercel.app/api/shop/find-product?id=" + id
      )
      .then((res) => setProducts(res.data.data));
  }, [id, refetch]);

  const [showBuyPrice, setShowBuyPrice] = useState(false);

  const delteHandle = (id: string) => {
    axios
      .delete(
        "https://home-store-backend.vercel.app/api/shop/delete-product/" + id
      )
      .then((res) => {
        if (res.data.statusCode === 200) {
          toast.success("ডিলিট হয়েছে।");
          move("/");
        }
      });
  };

  const [waiting, setWaiting] = useState(false);

  const formHandle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data: Partial<tProducts> = {
      banglaName: form.banglaName.value,
      englishName: form.englishName.value,
      buyingPrice: form.buyingPrice.value,
      sellingPrice: form.sellingPrice.value,
    };
    axios.put("https://home-store-backend.vercel.app/api/shop/update-product/" + products?._id, data).then((res) => {
      if (res.data?.statusCode === 200) {
        setWaiting(false);
        Swal.fire({
          title: "আপডেট হয়েছে",
          icon: "success",
          draggable: true,
        });
        setRefetch(p => !p)

      }
    });
  };
  console.log(products);
  return (
    <div>
      <img src={products?.image} className="w-full" alt="" />
      <table className="w-full mt-3">
        <th></th>
        <th></th>
        <tbody>
          <tr>
            <td className="border p-2">বাংলা নাম</td>
            <td className="border p-2">{products?.banglaName}</td>
          </tr>
          <tr>
            <td className="border p-2">ইংরেজি নাম</td>
            <td className="border p-2">{products?.englishName}</td>
          </tr>
          <tr>
            <td className="border p-2">ক্রয় মূল্য</td>
            <td className="border p-2">
              {showBuyPrice ? (
                `${products?.buyingPrice} /=`
              ) : (
                <button onClick={() => setShowBuyPrice(true)}>
                  <Eye />
                </button>
              )}
            </td>
          </tr>
          <tr>
            <td className="border p-2">বিক্রয় মূল্য</td>
            <td className="border p-2">{products?.sellingPrice} /=</td>
          </tr>
          <tr>
            <td className="border p-2">Bar Code</td>
            <td className="border p-2">{products?.barCode || "n/a"}</td>
          </tr>
        </tbody>
      </table>
      <button
        onClick={() => delteHandle(products?._id as string)}
        className="bg-red-400 flex items-start text-white p-2 rounded-md mx-auto my-4 gap-1"
      >
        <Trash /> Delete
      </button>

      <form onSubmit={formHandle} className="flex flex-col gap-3">
        <input
          required
          name="englishName"
          className="w-full border-2 border-gray-300 focus:outline-green-600 font-medium text-lg py-2 pl-1 rounded-md"
          type="text"
          placeholder="ইংরেজি নাম"
          defaultValue={products?.englishName}
        />
        <input
          required
          name="banglaName"
          className="w-full border-2 border-gray-300 focus:outline-green-600 font-medium text-lg py-2 pl-1 rounded-md"
          type="text"
          placeholder="বাংলা নাম"
          defaultValue={products?.banglaName}
        />
        <input
          required
          name="buyingPrice"
          className="w-full border-2 border-gray-300 focus:outline-green-600 font-medium text-lg py-2 pl-1 rounded-md"
          type="password"
          placeholder="ক্রয় মুল্য"
          defaultValue={products?.buyingPrice}
        />
        <input
          required
          name="sellingPrice"
          className="w-full border-2 border-gray-300 focus:outline-green-600 font-medium text-lg py-2 pl-1 rounded-md"
          type="text"
          placeholder="বিক্রয় মুল্য"
          defaultValue={products?.sellingPrice}
        />

        <button
          disabled={waiting}
          className="bg-green-400 rounded-md py-2 text-white text-2xl font-bold"
        >
          {waiting ? "অপেক্ষা করুন" : "Update"}
        </button>
      </form>




      {!products?.barCode || !products?.strock || products?.expiredDate ? <div>
        <h1 className="text-2xl font-bold my-3 text-center mt-5">অতিরিক্ত তথ্য</h1>
        <div className="flex justify-evenly mb-12">{!products?.barCode ? <UpdateBarcode id={products?._id as string} /> : null}
          {!products?.strock ? <UpdateStock /> : null}
          {!products?.expiredDate ? <UpdateExpireDate /> : null}</div>
      </div> : null}





      <BarCodeScannerComponent />
    </div>
  );
};

export default SingleProduct;
