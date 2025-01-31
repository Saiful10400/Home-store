import { Camera, CheckCircle2 } from "lucide-react";
 
import { imageUploadToDb } from "../utils/imageUpload";
import axios from "axios";
import {  useState } from "react";
import { toast } from "react-toastify";
import { tProducts } from "../types";

 

const CreateProduct = () => {
const [waiting,setWaiting]=useState(false)
    const[isImageAdded,setIsImageAdded]=useState(false)
    const formHandle=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        const form=e.currentTarget
        const data:tProducts={
            banglaName:form.banglaName.value,
            englishName:form.englishName.value,
            buyingPrice:form.buyingPrice.value,
            sellingPrice:form.sellingPrice.value,
            image:""
        }
        setWaiting(true)
        const photoUrl=await imageUploadToDb(form.image.files[0])
        data.image=photoUrl
        axios.post("https://home-store-backend.vercel.app/api/shop/create-product",data)
        .then(res=>{
            if(res.data.statusCode===200){
                setWaiting(false)
                form.reset()
                setIsImageAdded(false)
                toast.success("নতুন পন্য যুক্ত হয়েছে ।")
            }
        })
    }


    return (
       <form onSubmit={formHandle} className="flex flex-col gap-3 px-2">
        <input required name="englishName" className="w-full border-2 border-gray-300 focus:outline-green-600 font-medium text-lg py-2 pl-1 rounded-md" type="text" placeholder="ইংরেজি নাম" />
        <input required name="banglaName" className="w-full border-2 border-gray-300 focus:outline-green-600 font-medium text-lg py-2 pl-1 rounded-md" type="text" placeholder="বাংলা নাম" />
        <input required name="buyingPrice" className="w-full border-2 border-gray-300 focus:outline-green-600 font-medium text-lg py-2 pl-1 rounded-md" type="number" placeholder="ক্রয় মুল্য" />
        <input required name="sellingPrice" className="w-full border-2 border-gray-300 focus:outline-green-600 font-medium text-lg py-2 pl-1 rounded-md" type="number" placeholder="বিক্রয় মুল্য" />
        <label htmlFor="image">
            <div className="w-full rounded-md flex justify-center items-center flex-col gap-2 border-2 border-gray-300 py-3">
                {
                    isImageAdded?<><CheckCircle2 className="text-green-500" height={40} width={40}/> <h1>ছবি যুক্ত হয়েছে</h1></>:<><Camera height={40} width={40}/> <h1>পণ্যের ছবি তুলুন</h1></>
                }
            </div>
            <input onInput={(e : React.ChangeEvent<HTMLInputElement>)=>{
               const target=e.target as HTMLInputElement
               const file: File | undefined = target.files?.[0];
                if( file){
                    setIsImageAdded(true)
                } else{
                    setIsImageAdded(false)
                }
            }} name="image" type="file" id="image" hidden />
        </label>
        <button disabled={waiting} className="bg-green-400 rounded-md py-2 text-white text-2xl font-bold">{waiting?"অপেক্ষা করুন":"Ok"}</button>
       </form>
    );
};

export default CreateProduct;