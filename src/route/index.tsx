import { Route, Routes } from "react-router-dom";
import Home from "../page/Home";
import Root from "../Root";
import CreateProduct from "../page/CreateProduct";
import SingleProduct from "../page/SingleProduct";
 

 

const pagesRoute=
<Routes>
    <Route path="/" element={<Root/>}>
        <Route index element={<Home/>}/>
        <Route path="/create-product" element={<CreateProduct/>}/>
        <Route path="/product/:id" element={<SingleProduct/>}/>
    </Route>
</Routes>


export default pagesRoute