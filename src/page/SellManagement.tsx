import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import { useEffect, useState } from "react";
import { tProducts } from "../types";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const SellManagement = () => {
  const [products, setProducts] = useState([]);
  const [discount, setDiscount] = useState<number | null | string>(null);
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

  // product field.
  type tProductField = {
    id: number;
    volume: string;
    singleSellingPrice: string | number;
    singleBuyingPrice: string | number;
    product: string;
    totalPrice: string;
    totalProfit: string;
  };
  const [productField, setProductField] = useState<tProductField[]>([
    {
      id: Date.now(),
      singleBuyingPrice: "",
      singleSellingPrice: "",
      totalProfit: "",
      volume: "",
      product: "",
      totalPrice: "",
    },
  ]);

  const removeField = (id: number) => {
    setProductField(productField.filter((item) => item.id !== id));
  };
  const addField = () => {
    setProductField((p) => [
      ...p,
      {
        id: Date.now(),
        singleBuyingPrice: "",
        singleSellingPrice: "",
        totalProfit: "",
        volume: "",
        product: "",
        totalPrice: "",
      },
    ]);
  };
  // update state.
  const updateProduct = (
    id: number,
    product: string,
    sellingPrice: string | number,
    buyIngPrice: string | number
  ) => {
    const modifiedProduct: tProductField[] = productField.map(
      (item: tProductField) => {
        if (item.id === id) {
          return {
            ...item,
            product,
            singleBuyingPrice: buyIngPrice,
            singleSellingPrice: sellingPrice,
          };
        } else {
          return item;
        }
      }
    );
    setProductField(modifiedProduct);
  };
  // update state.
  const updateVolume = (listId: number, volume: string) => {
    const modifiedProduct = productField.map((item: tProductField) => {
      if (item.id === listId) {
        return {
          ...item,
          volume,
          totalProfit: (
            (Number(item.singleSellingPrice) - Number(item.singleBuyingPrice)) *
            Number(volume)
          )
            .toFixed(1)
            .toString(),
          totalPrice: (Number(item.singleSellingPrice) * Number(volume))
            .toFixed(1)
            .toString(),
        };
      } else {
        return item;
      }
    });
    setProductField(modifiedProduct);
  };

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!dueCustomerId && sellingStatus !== "nogod") {
      toast.error("বাকেয়া ক্রেতার নাম উল্লখ করেন নি।");
      return;
    }
setWaiting(true)
    axios.post("https://home-store-backend.vercel.app/api/shop/sell/create", {
      productField,
      dueCustomerId,
      discount: Number(e.currentTarget.discount.value),
      paymentType: sellingStatus,
    })
    .then(res=>{
      if(res.data.statusCode===200){
        setWaiting(false)
        Swal.fire({
          title: "যুক্ত হয়েছে",
          icon: "success",
          draggable: true
        });
      }
    })
  };

  return (
    <form onSubmit={formSubmit} className="flex flex-col gap-3 mt-4">
      {productField.map((item: tProductField) => {
        return (
          <div className="flex gap-2">
            <div className="w-[50%] ">
              <Autocomplete
                onChange={(_, value) => {
                  if (value?.id) {
                    updateProduct(
                      item.id,
                      value?.id,
                      value.sellPrice,
                      value?.buyPrice
                    );
                  }
                }}
                disablePortal
                fullWidth
                options={products?.map((item: tProducts) => ({
                  label: item.banglaName + " ===> " + item.englishName,
                  id: item._id,
                  sellPrice: item.sellingPrice,
                  buyPrice: item.buyingPrice,
                }))}
                renderInput={(params) => {
                  return <TextField required {...params} label="পন্যের নাম" />;
                }}
              />
            </div>
            <div className="w-[50%] gap-2 flex items-center">
              <input
                disabled={item.product ? false : true}
                required
                onChange={(e) => updateVolume(item.id, e.target.value)}
                name="englishName"
                className=" w-[70px] border-2 border-gray-300 focus:outline-green-600 font-medium text-lg py-2 pl-1 text-center h-full rounded-md"
                type="text"
                placeholder="পরিমান"
              />
              <span className="  w-[100px] border-2 border-gray-300 h-full rounded-md  flex justify-center items-center text-lg font-bold">
                {item.product ? item.totalPrice || item.singleSellingPrice : 0}{" "}
                /=
              </span>

              <button
                onClick={() => removeField(item.id)}
                type="button"
                className="bg-gray-500 p-1 rounded-full text-white"
              >
                <X width={20} height={20} />
              </button>
            </div>
          </div>
        );
      })}

      <div>
        <button
          onClick={addField}
          type="button"
          className="bg-gray-800 text-white py-3 px-5 rounded-md"
        >
          Add
        </button>
      </div>

      <h1 className="flex justify-between font-semibold rounded-md border-2 px-1 py-3">
        মোট পন্যের মুল্যঃ{" "}
        <span>
          {productField.reduce(
            (acc, item) => Number(acc) + Number(item.totalPrice || 0),
            0
          )}{" "}
          /=
        </span>
      </h1>

      <input
        onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
          setDiscount(e.target.value)
        }
        name="discount"
        defaultValue={discount || ""}
        className="w-full border-2 border-gray-300 focus:outline-green-600 font-medium text-lg py-2 pl-1 rounded-md"
        type="text"
        placeholder="ডিস্কাউন্ট (যদি থাকে)"
      />
      <h1 className="flex justify-between font-semibold rounded-md border-2 px-1 py-3">
        ক্রেতা পরিশোধ করবেঃ{" "}
        <span>
          {productField.reduce(
            (acc, item) => Number(acc) + Number(item.totalPrice || 0),
            0
          ) - Number(discount || 0)}{" "}
          /=
        </span>
      </h1>

      <div className="flex items-center justify-center gap-8 border-2 border-gray-300 py-2 rounded-md text-lg">
        <label className="flex items-center gap-3" htmlFor="nogod">
          <input
            onClick={() => {
              setSEllingStatus("nogod");
              setDueCustomerId("");
            }}
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
            onClick={() => {
              setSEllingStatus("baki");
              setDueCustomerId("");
            }}
            required
            className="scale-150"
            id="baki"
            type="radio"
            name="sellStatus"
            value="baki"
          />{" "}
          বাকী
        </label>
        <label className="flex items-center gap-3" htmlFor="bakiNogod">
          <input
            onClick={() => {
              setSEllingStatus("bakiNogod");
              setDueCustomerId("");
            }}
            required
            className="scale-150"
            id="bakiNogod"
            type="radio"
            name="sellStatus"
            value="bakiNogod"
          />{" "}
          বাকী ও নগদ
        </label>
      </div>

      {sellingStatus === "baki" || sellingStatus === "bakiNogod" ? (
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
      {sellingStatus === "bakiNogod" ? (
        <input
          name="nogodAday"
          className="w-full border-2 border-gray-300 focus:outline-green-600 font-medium text-lg py-2 pl-1 rounded-md"
          type="text"
          placeholder="নগদ টাকা আদায়"
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
