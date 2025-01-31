import axios from "axios";
import { useEffect, useState } from "react";
import { tProducts } from "../types";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState(null);
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/shop/find-product")
      .then((res) => setProducts(res.data.data));
  }, []);

  const move = useNavigate();

  return (
    <div>
      <form className="flex items-center gap-x-5 px-5 sticky z-10 top-6 pt-6 pb-4 bg-white">
        <input
          name="englishName"
          className="w-full border-2 border-gray-300 focus:outline-green-600 font-medium text-lg py-2 pl-1 rounded-md"
          type="text"
          placeholder="পন্যের নাম"
        />
        <button className="bg-gray-800 text-white py-3 px-5 rounded-md">
          খুঁজুন
        </button>
      </form>

      <div className="flex flex-col relative   gap-2 mt-6">
        {products
          ? (products as tProducts[]).map((item: tProducts, idx: number) => (
              <button
                onClick={() => move(`product/${item._id}`)}
                className=" gap-2  w-full bg-gray-200 py-2 flex justify-between items-center"
              >
                <span className="w-[50px] ">{++idx}</span>
                <img
                  className="w-[80px] object-cover h-[50px] rounded-md"
                  src={item.image}
                  alt=""
                />
                <span className=" w-[200px]">{item.banglaName}</span>
                <span className="w-[100px] ">{item.sellingPrice}/=</span>
              </button>
            ))
          : ""}
      </div>
    </div>
  );
};

export default Home;
