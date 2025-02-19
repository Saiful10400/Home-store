import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SellsCard from "../component/Shared/SellsCard";

type Product = {
  name: {
    banglaName: string;
  };
  quantity: number;
  singleBuyingPrice: number;
  singleSellingPrice: number;
  totalPrice: number;
  totalProfit: number;
};

type Order = {
  products: Product[];
  discount: number;
  paymentType: string;
  profit: number;
  expenses: number;
};

type Orders = Order[];

const SingleDaySells = () => {
  const { id } = useParams();

  const [sells, setSells] = useState<Orders | null>(null);
  useEffect(() => {
    axios
      .get("https://home-store-backend.vercel.app/api/shop/sell/" + id)
      .then((res) => setSells(res.data?.data));
  }, [id]);

  if (!sells) return;

  return (
    <div>
      <h1 className="text-center text-xl font-semibold fixed top-[46px] bg-white w-full">হিসাবের তারিখঃ {id}</h1>

      <div className="mt-10 grid grid-cols-1 gap-5">
        {sells.map((item, idx) => (
          <SellsCard data={item} key={idx} />
        ))}
      </div>
    </div>
  );
};

export default SingleDaySells;
