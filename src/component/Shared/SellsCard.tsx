import dateStringToDateTime from "../../utils/dateStirngToTimeDate";

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

type tOrder = {
  products: Product[];
  discount: number;
  paymentType: string;
  profit: number;
  expenses: number;
  created?:string
};

const SellsCard = ({ data }: { data: tOrder }) => {
  
  return (
    <div className="bg-gray-300 rounded-md py-3">
      <div className="text-center font-semibold mb-3">ক্রয়ের সময়ঃ {data?.created && dateStringToDateTime(data?.created)}</div>
     <table className="text-center">
      <thead>
        <tr >
          <th className="border p-2">#</th>
          <th className="border p-2">পন্যের নাম</th>
          <th className="border p-2">পরিমান</th>
          <th className="border p-2">মোট মুল্য</th>
          <th className="border p-2">মোট লাভ</th>
        </tr>
      </thead>
      {data.products.map((item, idx) => (
        <tr key={item.name.banglaName}>
          {" "}
          <td className="border p-2">{(idx += 1)}.</td>
          <td className="border p-2">{item.name.banglaName}</td>
           <td className="border p-2">{item.quantity}</td>
           <td className="border p-2">{item.totalPrice}</td>
           <td className="border p-2">{item.totalProfit}</td>
        </tr>
      ))}
     </table>
     <div className="mt-4 text-center font-semibold border-t-2 border-black pt-2">
      <h1>মোট আদায়ঃ {data.expenses}=/</h1>
      <h1 className="mt-2">মোট লাভঃ {data.profit}=/</h1>
     </div>
    </div>
  );
};

export default SellsCard;
