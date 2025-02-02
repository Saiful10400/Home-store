import { Route, Routes } from "react-router-dom";
import Home from "../page/Home";
import Root from "../Root";
import CreateProduct from "../page/CreateProduct";
import SingleProduct from "../page/SingleProduct";
import DueCustomer from "../page/DueCustomer";
import SellManagement from "../page/SellManagement";
 

 

const pagesRoute=
<Routes>
    <Route path="/" element={<Root/>}>
        <Route index element={<Home/>}/>
        <Route path="/create-product" element={<CreateProduct/>}/>
        <Route path="/product/:id" element={<SingleProduct/>}/>
        <Route path="/due-management" element={<DueCustomer/>}/>
        <Route path="/sell-management" element={<SellManagement/>}/>
    </Route>
</Routes>


export default pagesRoute