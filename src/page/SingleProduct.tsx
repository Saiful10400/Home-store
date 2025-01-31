import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { tProducts } from "../types";
import { Eye } from "lucide-react";

 

const SingleProduct = () => {
    const{id}=useParams()
    const [products, setProducts] = useState<tProducts|null>(null);
    useEffect(() => {
      axios
        .get("http://localhost:8000/api/shop/find-product?id="+id)
        .then((res) => setProducts(res.data.data));
    }, [id]);


    const [showBuyPrice,setShowBuyPrice]=useState(false)
    
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
                    <td className="border p-2">{products?.banglaName}</td>
                    </tr>
                    <tr>
                    <td className="border p-2">ক্রয় মূল্য</td>
                    <td className="border p-2">{showBuyPrice?`${products?.buyingPrice} /=`:<button onClick={()=>setShowBuyPrice(true)}><Eye/></button>}</td>
                    </tr>
                    <tr>
                    <td className="border p-2">বিক্রয় মূল্য</td>
                    <td className="border p-2">{products?.sellingPrice} /=</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default SingleProduct;