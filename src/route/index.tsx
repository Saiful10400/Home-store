import { Route, Routes } from "react-router-dom";
import Home from "../page/Home";
import Root from "../Root";
import CreateProduct from "../page/CreateProduct";
import SingleProduct from "../page/SingleProduct";
import SellManagement from "../page/CreateSell";
import AllSells from "../page/AllSells";
import SingleDaySells from "../page/SingleDaySells";
import DueCustomerDetails from "../page/DueCustomerDetails";
import DueSells2 from "../page/DueSells2";
import Calculator from "../page/Calculator";
import Exp from "../Experiment-center/Exp";
 

 

const pagesRoute=
<Routes>
    <Route path="/" element={<Root/>}>
        <Route index element={<Home/>}/>
        <Route path="/exp" element={<Exp/>}/>
        <Route path="/calculator" element={<Calculator/>}/>
        <Route path="/create-product" element={<CreateProduct/>}/>
        <Route path="/product/:id" element={<SingleProduct/>}/>
        <Route path="/due-management" element={<DueSells2/>}/>
        <Route path="/sell-management" element={<SellManagement/>}/>
        <Route path="/all-sells" element={<AllSells/>}/>
        <Route path="/all-sells/:id" element={<SingleDaySells/>}/>
        <Route path="/due-management/due-customer/:id" element={<DueCustomerDetails/>}/>
    </Route>
</Routes>


export default pagesRoute