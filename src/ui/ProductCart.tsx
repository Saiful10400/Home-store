import { Heart } from "lucide-react";
import { Tproduct } from "../types";

const ProductCart = ({ data }: { data: Tproduct }) => {
  return (
    <div className="text-center pb-[20px]  ">
      <div className=" top-[-10px] flex mb-[10px] justify-between w-full">
        <h1 className="text-[9px] font-bold px-1 leading-[3] text-white bg-[#774C7D]">WOMEN</h1>
        <button className="cursor-pointer">
          <Heart className="text-gray-400" />
        </button>
      </div>
      <img className="h-[229px] object-cover" src={data.image} alt="product image" />
      <h1 className="font-bold mt-[30px] text-sm">{data.name}</h1>
      <h1 className="font-light text-[#898989] text-[13px]">by {data.by}</h1>
      <h1 className="font-light  text-[13px] my-[13px]">{data.shop}</h1>
      <h1 className="font-bold text-base">
        <span className="font-light  text-[13px]">from</span> {data.price}
      </h1>
      <button className="px-12 py-3 mt-[15px] border-gray-400 border-2 font-bold text-sm">
        ADD TO BAG
      </button>
    </div>
  );
};

export default ProductCart;
