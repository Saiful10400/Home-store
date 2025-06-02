import axios from "axios";
import { useEffect, useState } from "react";
import DuePaymentCard from "../ui/DuePaymentCard";
import DuePaymentAddButton from "../ui/DuePaymentAddButton";

export type TpaymentRecord = {
    _id: string;
    amount: number;
    name: string;
    payment: boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
};

const DueSells2 = () => {

    const [due, setDue] = useState<TpaymentRecord[] | null>(null)
    const [reFetche, setReFetch] = useState<boolean>(false)
    const reFetcher = () => setReFetch(p => !p)

    useEffect(() => {
        axios
            .get("https://home-store-backend.vercel.app/api/shop/due-payment2/get")
            .then((res) => setDue(res.data.data));
    }, [reFetche]);

    console.log(due)
    return (
        <div>

            {/* new customer adding button. */}


            <div className="sticky top-12 z-10  bg-white"><DuePaymentAddButton refetch={reFetcher} /></div>


            {/* payments recor ui. */}

            <div className="mt-6 grid grid-cols-1 gap-3">
                {
                    due?.map((item: TpaymentRecord, idx: number) => <DuePaymentCard reFetch={reFetcher} index={++idx} data={item} key={item._id} />)
                }
            </div>

            <div className="flex flex-col justify-center items-center bg-red-600 font-semibold gap-2 py-4 my-6 mb-8 rounded-md text-white"><h1>মোট বাকিঃ</h1><span>{due?.reduce((sum, item) => sum + item.amount, 0)} টাকা</span></div>



        </div>
    );
};

export default DueSells2;