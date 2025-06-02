import axios from "axios";
import { useEffect, useState } from "react";
import { tProducts } from "../types";
import { useNavigate } from "react-router-dom";
import { LucideClockArrowDown } from "lucide-react";

const Home = () => {
  const [products, setProducts] = useState(null);
  useEffect(() => {
    axios
      .get("https://home-store-backend.vercel.app/api/shop/find-product")
      .then((res) => setProducts(res.data.data?.slice(0,5)));
  }, []);

  const move = useNavigate();
  const [searchedStatus, setSearchedStatus] = useState(false);
  const searchHandle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchTerm = e.currentTarget.searchTerm.value;
    axios
      .get(
        "https://home-store-backend.vercel.app/api/shop/find-product?searchTerm=" +
          searchTerm
      )
      .then((res) => {
        setProducts(res.data.data);
        setSearchedStatus(true);
      });
  };

  return (
    <div >
      <form
        onSubmit={searchHandle}
        className="flex items-center gap-x-5 px-5 sticky z-10 top-6 pt-6 pb-4 bg-white"
      >
        <input
          name="searchTerm"
          className="w-full border-2 border-gray-300 focus:outline-green-600 font-medium text-lg py-2 pl-1 rounded-md"
          type="text"
          placeholder="পন্যের নাম"
        />
        {searchedStatus ? (
          <button
            onClick={() => {
              axios
                .get(
                  "https://home-store-backend.vercel.app/api/shop/find-product"
                )
                .then((res) => {
                  setProducts(res.data.data);
                  setSearchedStatus(false);
                });
            }}
            className="bg-gray-800 text-white py-3 px-5 rounded-md"
          >
            <LucideClockArrowDown />
          </button>
        ) : (
          <button className="bg-gray-800 text-white py-3 px-5 rounded-md">
            খুঁজুন
          </button>
        )}
      </form>

      <div className="flex flex-col relative   gap-2 mt-6">
        {products
          ? (products as tProducts[]).map((item: tProducts, idx: number) => (
              <button
                onClick={() => move(`product/${item._id}`)}
                className=" gap-2 rounded-md w-full bg-gray-200 py-2 flex justify-between items-center"
              >
                <span className="w-[50px] ">{++idx}</span>
                <img
                  className="w-[80px] object-cover h-[50px] rounded-md"
                  src={item.image}
                  alt=""
                />
                <span className=" w-[200px]  overflow-hidden">
                  {item.banglaName}
                </span>
                <span className="w-[100px] text-xl font-bold ">
                  {item.sellingPrice}/=
                </span>
              </button>
            ))
          : ""}
      </div>
    </div>
  );
};

export default Home;
