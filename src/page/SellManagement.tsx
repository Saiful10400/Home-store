import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import { useEffect, useState } from "react";
import { tProducts } from "../types";

const SellManagement = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios
      .get("https://home-store-backend.vercel.app/api/shop/find-product")
      .then((res) => setProducts(res.data.data));
  }, []);

  // due customers.
  const [dueCustomer, setDueCustomer] = useState([]);
  useEffect(() => {
    axios
      .get("https://home-store-backend.vercel.app/api/shop/customer/due")
      .then((res) => setDueCustomer(res?.data?.data));
  }, []);

  // form submit handle.
  const [sellingStatus, setSEllingStatus] = useState("");
  const [waiting, setWaiting] = useState(false);

  const [dueCustomerId, setDueCustomerId] = useState<string | null | undefined>(
    null
  );
  const [productId, setProductId] = useState<string | null | undefined>(null);
  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    
  };
console.log(dueCustomerId,productId)
  return (
    <form onSubmit={formSubmit} className="flex flex-col gap-3 mt-4">
      <Autocomplete
        onChange={(_, value) => {
          setProductId(value?.id);
        }}
        disablePortal
        fullWidth
        options={products?.map((item: tProducts) => ({
          label: item.banglaName + " ===> " + item.englishName,
          id: item._id,
        }))}
        renderInput={(params) => {
          return <TextField required {...params} label="পন্যের নাম" />;
        }}
      />
      <input
        required
        name="englishName"
        className="w-full border-2 border-gray-300 focus:outline-green-600 font-medium text-lg py-2 pl-1 rounded-md"
        type="text"
        placeholder="পরিমান"
      />

      <input
        required
        name="englishName"
        className="w-full border-2 border-gray-300 focus:outline-green-600 font-medium text-lg py-2 pl-1 rounded-md"
        type="text"
        defaultValue={0}
        placeholder="ডিস্কাউন্ট (যদি থাকে)"
      />

      <div className="flex items-center justify-center gap-8 border-2 border-gray-300 py-2 rounded-md text-lg">
        <label className="flex items-center gap-3" htmlFor="nogod">
          <input
            onClick={() => setSEllingStatus("nogod")}
            required
            className="scale-150"
            id="nogod"
            type="radio"
            name="sellStatus"
            value="nogod"
          />{" "}
          নগদ
        </label>
        <label className="flex items-center gap-3" htmlFor="baki">
          <input
            onClick={() => setSEllingStatus("baki")}
            required
            className="scale-150"
            id="baki"
            type="radio"
            name="sellStatus"
            value="nogod"
          />{" "}
          বাকী
        </label>
      </div>

      {sellingStatus === "baki" ? (
        <Autocomplete
          onChange={(_, value) => {
            setDueCustomerId(value?.id);
          }}
          disablePortal
          fullWidth
          options={dueCustomer?.map(
            (item: { name: string; address: string; _id: string }) => ({
              label: item.name + " ===> " + item.address,
              id: item?._id,
            })
          )}
          renderInput={(params) => {
            return <TextField required {...params} label="বাকী ক্রেতার নাম" />;
          }}
        />
      ) : (
        ""
      )}

      <button
        disabled={waiting}
        className="bg-green-400 rounded-md py-2 text-white text-2xl font-bold"
      >
        {waiting ? "অপেক্ষা করুন" : "Ok"}
      </button>
    </form>
  );
};

export default SellManagement;
