import { Outlet } from "react-router-dom";
import Nav from "./component/Nav";
import { ToastContainer } from "react-toastify";

 

const Root = () => {
    return (
        <div>
            <Nav/>
            <div className="px-2 "><Outlet/></div>
            <ToastContainer /> 
        </div>
    );
};

export default Root;