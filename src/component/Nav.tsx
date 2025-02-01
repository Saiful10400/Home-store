import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/nav.css";

const Nav = () => {
  const [show, setShow] = useState(false);

  const move = useNavigate();

  const navigate = (route: string) => {
    setShow(false);
    move(route);
  };

  useEffect(() => {
    const fn = () => setShow(false);
    window.addEventListener("click", fn);

    return () => window.removeEventListener("click", fn);
  }, []);

  return (
    <div className="sticky top-0 bg-white  z-20">
      <button
        className="pl-2"
        onClick={(e) => {
          e.stopPropagation();
          setShow((p) => !p);
        }}
      >
        <Menu width={40} height={40} />
      </button>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-[60vw] h-screen glassBg p-2 fixed  left-0  duration-300 flex flex-col gap-2 ${
          show ? "translate-x-0" : "-translate-x-[100%]"
        }`}
      >
        <button
          className="bg-gray-700 text-white w-full inline-block text-center rounded-md py-1"
          onClick={() => navigate("/sell-management")}
        >
          বিক্রির হিসাব
        </button>
        <button
          className="bg-gray-700 text-white w-full inline-block text-center rounded-md py-1"
          onClick={() => navigate("/due-management")}
        >
          বাকির হিসাব
        </button>
        <button
          className="bg-gray-700 text-white w-full inline-block text-center rounded-md py-1"
          onClick={() => navigate("/")}
        >
          Home
        </button>
        <button
          className="bg-gray-700 text-white w-full inline-block text-center rounded-md py-1"
          onClick={() => navigate("/create-product")}
        >
          নতুন পণ্য যুক্ত করুন
        </button>
      </div>
    </div>
  );
};

export default Nav;
