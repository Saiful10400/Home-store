import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";


const DuePaymentAddButton = ({ refetch }: { refetch: () => void }) => {
    const [formOn, setFormOn] = useState<boolean>(false)



    // formSubmit handle.
    const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const form = e.currentTarget
        const name = form.customerName.value
        const amount = form.amount.value
        const payment = false


        Swal.fire({
            title: `${name} এর ${amount} টাকা যোগ করবেন ?`,
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: "Ok",

        }).then(async (result) => {
            if (!result.isConfirmed) return
            const response = await axios.post("https://home-store-backend.vercel.app/api/shop/due-payment2/create", { name, amount, payment })
            if (response.data.statusCode === 200) {
                refetch()
                setFormOn(false)
            }

        });
    }


    return (
        <div className=" ">
            {!formOn && <div>
                <button onClick={() => setFormOn(true)} className="text-center w-full bg-black text-white py-2 font-semibold text-xl rounded-md">নতুন বাকি</button>
            </div>}

            {formOn && <form onSubmit={formSubmit} className="flex flex-col gap-2">
                <input name="customerName" required type="text" className="border border-black w-full rounded-md text-xl py-1 pl-1" placeholder="কাস্টমারের নাম" />
                <input name="amount" required type="number" className="border border-black w-full rounded-md text-xl py-1 pl-1" placeholder="বাকি টাকার পরিমান" />
                <button className="text-center w-full bg-black text-white py-2 font-semibold text-xl rounded-md">Ok</button>
            </form>}

        </div>
    );
};

export default DuePaymentAddButton;