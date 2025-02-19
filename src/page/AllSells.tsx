import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


interface tGroupedData {
    _id: string; // Represents the date as a string (e.g., "17-02-2025")
    data: {
      _id: string;
      products: {
        name: string;
        quantity: number;
        singleBuyingPrice: number;
        singleSellingPrice: number;
        totalPrice: number;
        totalProfit: number;
        _id: string;
      }[];
      Discount: number;
      paymentType: string;
      profit: number;
      expenses: number;
      createdAt: string;
      updatedAt: string;
      __v: number;
    }[];
  }

 
const AllSells = () => {

const [allSells,setAllSells]=useState([])

useEffect(()=>{
axios.get("https://home-store-backend.vercel.app/api/shop/sell").then(res=>setAllSells(res?.data?.data))
},[])

 

    return (
         <div className="flex flex-col relative   gap-2 mt-6">
                {allSells
                  ? (allSells ).map((item:tGroupedData) => (
                      <Link to={item._id}
                        // onClick={() => move(`product/${item._id}`)}
                        className=" gap-2 rounded-md w-full bg-gray-200 py-2 flex flex-col  justify-between items-center"
                      >
                       
                       
                        <span className="  marker:  overflow-hidden">
                          তারিখঃ  {item?._id}
                        </span>
                        
                        <span className="  marker:  overflow-hidden">
                          মোট বিক্রিঃ  {item?.data?.reduce((acc:number,item)=>acc+item.expenses,0)} =/
                        </span>
                        <span className="  marker:  overflow-hidden">
                          মোট লাভঃ  {item?.data?.reduce((acc:number,item)=>acc+item.profit,0)} =/
                        </span>
                       
                      </Link>
                    ))
                  : ""}
              </div>
    );
};

export default AllSells;