import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { tProducts } from "../types";
import { Eye, Trash } from "lucide-react";
import { toast } from "react-toastify";

const SingleProduct = () => {
  const { id } = useParams();
  const [products, setProducts] = useState<tProducts | null>(null);
  const move=useNavigate()
  useEffect(() => {
    axios
      .get(
        "https://home-store-backend.vercel.app/api/shop/find-product?id=" + id
      )
      .then((res) => setProducts(res.data.data));
  }, [id]);

  const [showBuyPrice, setShowBuyPrice] = useState(false);

  const delteHandle=(id:string)=>{
    axios.delete(
        "https://home-store-backend.vercel.app/api/shop/delete-product/" + id
      )
      .then(res=>{
        if(res.data.statusCode===200){
            toast.success("ডিলিট হয়েছে।")
move("/")
          }
      })
  }

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
        </tbody>
      </table>
      <button onClick={()=>delteHandle(products?._id as string)} className="bg-red-400 flex items-start text-white p-2 rounded-md mx-auto my-4 gap-1"><Trash/> Delete</button>
    </div>
  );
};

export default SingleProduct;
