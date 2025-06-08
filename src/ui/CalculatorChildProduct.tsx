import React, { Dispatch, SetStateAction, useState } from "react";


const CalculatorChildProduct = ({ index, totalSetter }: { index: number, totalSetter: Dispatch<SetStateAction<{ index: number, tk: number }[]>> }) => {
    const [quantity, setquantity] = useState(0)
    const [perKg, setPerKg] = useState(0)
    return (
        <section className="flex justify-start gap-2 items-center">
            <h1>{index}</h1>
            <input className="border py-1 w-[35%] border-black pl-1 rounded-md" type="text" placeholder="Name" />
            <input onInput={(e: React.ChangeEvent<HTMLInputElement>) => { setquantity(Number(e.target.value)); totalSetter(p => { const restOf = p.filter(item => item.index !== index); return [...restOf, { index, tk: quantity * perKg }] }) }} className="border py-1 w-[20%] border-black pl-1 rounded-md" type="text" placeholder="Quantity" />
            <input onInput={(e: React.ChangeEvent<HTMLInputElement>) => { setPerKg(Number(e.target.value)); totalSetter(p => { const restOf = p.filter(item => item.index !== index); return [...restOf, { index, tk: quantity * perKg }] }) }} className="border py-1 w-[20%] border-black pl-1 rounded-md" type="text" placeholder="1/kg price" />
            <h1>{quantity * perKg}</h1>
        </section>
    );
};

export default CalculatorChildProduct;