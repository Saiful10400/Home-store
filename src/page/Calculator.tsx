import { useState } from "react";
import Button from "../ui/Button";
import CalculatorChildProduct from "../ui/CalculatorChildProduct";



const Calculator = () => {
    const [total, setTotal] = useState<{ index: number, tk: number }[]>([{ index: 0, tk: 0 }])

    const [child, setChild] = useState([<CalculatorChildProduct totalSetter={setTotal} index={1} />])

    const newBtnOnclickHandle = () => {
        setChild(p => [...p, <CalculatorChildProduct totalSetter={setTotal} index={child.length + 1} />])
    }


    console.log(total)
    return (
        <div>
            <Button text="New" onClick={newBtnOnclickHandle} />

            <section className="grid grid-cols-1 gap-2 mt-5">
                {child.map(item => item)}
            </section>

            {/* <h1 className="text-xl font-bold text-center">Total: <span className="ml-4">{total.reduce((acc,cv)=>acc.tk+cv.tk,0)}</span></h1> */}
        </div>
    );
};

export default Calculator;