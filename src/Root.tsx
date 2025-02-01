import { Outlet } from "react-router-dom";
import Nav from "./component/Nav";
import { ToastContainer } from "react-toastify";

 

const Root = () => {
    return (
        <>
            <Nav/>
            <div className="px-2"><Outlet/></div>
            <ToastContainer /> 
        </>
    );
};

export default Root;