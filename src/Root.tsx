import { Outlet } from "react-router-dom";
import Nav from "./component/Nav";
import { ToastContainer } from "react-toastify";

 

const Root = () => {
    return (
        <>
            <Nav/>
            <Outlet/>
            <ToastContainer /> 
        </>
    );
};

export default Root;