
import React, { useState } from 'react';
import { TpaymentRecord } from '../page/DueSells2';
import Swal from 'sweetalert2';
import axios from 'axios';

const DuePaymentCard = ({ data, index, reFetch }: { data: TpaymentRecord, index: number, reFetch: () => void }) => {



    const [amount, setAmount] = useState<number | null>(null)


    const updateDatabase = async (type: "add" | "remove") => {

        const response = await axios.put(`https://home-store-backend.vercel.app/api/shop/due-payment2/update/${data._id}`, { amount, payment: type === "remove" })
        if (response.data.statusCode === 200) {
            setAmount(0)
            reFetch()
            Swal.fire(type === "add" ? `${data.name} এর ${amount} টাকা যোগ করা হয়েছে।` : `${data.name} এর ${amount} টাকা বিয়োগ করা হয়েছে।`, "", "success");
        }

    }





    const buttonModalShow = (props: "add" | "remove") => {

        if (!amount) return
        if (props === "add") {
            Swal.fire({
                title: `${data.name} এর ${amount} টাকা যোগ করবেন ?`,
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: "Ok",

            }).then((result) => {
                if (!result.isConfirmed) return
                updateDatabase("add")

            });
        }
        if (props === "remove") {
            Swal.fire({
                title: `${data.name} এর ${amount} টাকা বিয়োগ করবেন ?`,
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: "Ok",

            }).then((result) => {
                if (!result.isConfirmed) return
                updateDatabase("remove")

            });
        }
    }



    return (
        <div className='border border-black py-5 px-2 rounded-md bg-gray-200 relative'>

            {/* <h1 className='absolute top-[-89%] left-[37%] text-red-500 font-bold text-[197px]'>x</h1> */}
            
            <div className='flex justify-between items-center'>
                <div className='text-lg flex flex-col justify-between gap-5 w-[30%]'><span className='font-medium text-xl'>{index}.
                    <span className={`text-red-600 ${data.amount===0&&"line-through text-green-600"}`}>{data.name}</span></span>
                    <span className={`font-bold text-xl ${data.amount===0&&"line-through text-green-600"}`}>{data.amount} টাকা</span></div>
                <div className='flex justify-center items-center gap-4'>
                    <button onClick={() => buttonModalShow("add")} className='border text-white font-semibold bg-green-600 px-3 rounded-full text-xl'>+</button>
                    <input placeholder='টাকা/=' value={amount || ""} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value))} className='text-center p-1 border w-[100px] rounded-sm border-black' type="number" />
                    <button disabled={data.amount===0} hidden={data.amount===0} onClick={() => buttonModalShow("remove")} className='border   px-3 rounded-full text-xl text-white font-semibold bg-red-600'>-</button>
                </div>
            </div>
        </div>
    );
};

export default DuePaymentCard;