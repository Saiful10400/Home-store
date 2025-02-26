import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// interface.

type DecimalValue = {
  $numberDecimal: string;
};

type User = {
  _id: string;
  name: string;
  phone: string;
  address: string;
  __v: number;
};

type Product = {
  name: string;
  quantity: DecimalValue;
  singleBuyingPrice: DecimalValue;
  singleSellingPrice: DecimalValue;
  totalPrice: DecimalValue;
  totalProfit: DecimalValue;
  _id: string;
};

type Sell = {
  _id: string;
  products: Product[];
  Discount: number;
  dueCustomer: string;
  paymentType: string;
  profit: number;
  expenses: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type SellRecord = {
  _id: string;
  user: User;
  sell: Sell;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type DataStructure = {
  user: User;
  sells: SellRecord[];
  payments:{amount:number}
};

const DueCustomerDetails = () => {
  const [data, setUserData] = useState<null | DataStructure>(null);

  const { id } = useParams();

  useEffect(() => {
    axios
      .get("https://home-store-backend.vercel.app/api/shop/sell/due-user/" + id)
      .then((res) => setUserData(res.data?.data));
  }, [id]);

  console.log(data);

  if (!data) return;




  // update price.
  const updatePriceForm=(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const amount = e.currentTarget.amount.value;

    axios
      .put(
        "https://home-store-backend.vercel.app/api/shop/due-payment/" +
          id+"?amount="+amount
      ).then(res=>{
        if(res.data.statusCode===200){
          window.location.reload()
        }
      })
       

  }




  return (
    <div>
      {/* user address. */}

      <div className="bg-gray-500 rounded-lg p-2 text-gray-50 text-center">
        <h1 className="font-semibold text-lg">
          নামঃ <span className="">{data.user.name}</span>
        </h1>
        <h1 className="font-semibold text-lg">
          ঠিকানাঃ <span className="">{data.user.address}</span>
        </h1>
        <h1 className="font-semibold text-lg">
          ফোনঃ <span className="">{data.user.phone}</span>
        </h1>
      </div>

      <div className="bg-gray-500 rounded-lg p-2 mt-6 text-gray-50 text-center">
        <h1 className="font-semibold text-lg mt-3">
          মোট বাকিঃ <span className="">{data.payments.amount} /=</span>
        </h1>
        <form onSubmit={updatePriceForm} className="mt-5 mb-3">
        <input
          name="amount"
          className="w-full text-black border-2 border-gray-300 focus:outline-green-600 font-medium text-lg py-2 pl-1 rounded-md"
          type="text"
          placeholder="টাকার পরিমাণ"
        />
        <button className="bg-green-500 py-2 px-5 rounded-md font-semibold mt-3">জমা করুন</button>
        </form>
      </div>
    </div>
  );
};

export default DueCustomerDetails;
