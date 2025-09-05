import { Camera, CheckCircle2 } from "lucide-react";
import { imageUploadToDb } from "../utils/imageUpload";
import axios from "axios";
import { useState } from "react";
import { tProducts } from "../types";
import Swal from "sweetalert2";

const CreateProduct = () => {
  const [waiting, setWaiting] = useState(false);
  const [isImageAdded, setIsImageAdded] = useState(false);

  const formHandle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data: tProducts = {
      banglaName: form.banglaName.value,
      englishName: form.englishName.value,
      buyingPrice: form.buyingPrice.value,
      sellingPrice: form.sellingPrice.value,
      stock: form.stock.value,
      expiredDate: form.expiredDate.value,
      image: "",
    };

    setWaiting(true);

    if (form.image.files?.[0]) {
      const photoUrl = await imageUploadToDb(form.image.files[0]);
      data.image = photoUrl;
    }

    axios
      .post("https://home-store-backend.vercel.app/api/shop/create-product", data)
      .then((res) => {
        setWaiting(false);
        if (res.data.statusCode === 200) {
          form.reset();
          setIsImageAdded(false);
          Swal.fire({
            title: "পণ্য যুক্ত হয়েছে",
            icon: "success",
            draggable: true,
          }).then(() => {
            window.location.reload();
          });
        }
      })
      .catch((err) => {
        setWaiting(false);
        console.error(err);
        Swal.fire({
          title: "ত্রুটি ঘটেছে",
          icon: "error",
          text: "পণ্য তৈরি করা যায়নি। আবার চেষ্টা করুন।",
        });
      });
  };

  return (
    <form
      onSubmit={formHandle}
      className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg space-y-4"
    >
      <h2 className="text-2xl font-bold text-center mb-4">নতুন পণ্য তৈরি করুন</h2>

      {/* Text Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          required
          name="englishName"
          type="text"
          placeholder="ইংরেজি নাম"
          className="border-2 border-gray-300 rounded-lg py-2 px-3 focus:outline-green-500"
        />
        <input
          required
          name="banglaName"
          type="text"
          placeholder="বাংলা নাম"
          className="border-2 border-gray-300 rounded-lg py-2 px-3 focus:outline-green-500"
        />
        <input
          required
          name="buyingPrice"
          type="text"
          placeholder="ক্রয় মূল্য"
          className="border-2 border-gray-300 rounded-lg py-2 px-3 focus:outline-green-500"
        />
        <input
          required
          name="sellingPrice"
          type="text"
          placeholder="বিক্রয় মূল্য"
          className="border-2 border-gray-300 rounded-lg py-2 px-3 focus:outline-green-500"
        />
        <input
          required
          name="stock"
          type="number"
          placeholder="স্টক"
          className="border-2 border-gray-300 rounded-lg py-2 px-3 focus:outline-green-500"
        />
        <input
          name="expiredDate"
          type="date"
          placeholder="মেয়াদ শেষের তারিখ"
          className="border-2 border-gray-300 rounded-lg py-2 px-3 focus:outline-green-500"
        />
      </div>

      {/* Image Upload */}
      <label htmlFor="image">
        <div className="w-full rounded-md flex justify-center items-center flex-col gap-2 border-2 border-gray-300 py-6 cursor-pointer hover:border-green-500 transition">
          {isImageAdded ? (
            <>
              <CheckCircle2 className="text-green-500" height={40} width={40} />
              <h1 className="font-medium">ছবি যুক্ত হয়েছে</h1>
            </>
          ) : (
            <>
              <Camera height={40} width={40} />
              <h1 className="font-medium">পণ্যের ছবি যুক্ত করুন</h1>
            </>
          )}
        </div>
        <input
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            setIsImageAdded(!!file);
          }}
          name="image"
          type="file"
          id="image"
          hidden
          accept="image/*"
        />
      </label>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={waiting}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold text-xl transition"
      >
        {waiting ? "অপেক্ষা করুন..." : "পণ্য তৈরি করুন"}
      </button>
    </form>
  );
};

export default CreateProduct;
