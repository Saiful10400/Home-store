import { Plus } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DueCustomer = () => {
  // modal materials.
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  type tDueCustomer = {
    name: string;
    phone?: string;
    address: string;
  };

  // fetch due customer.
  const [dueCustomer, setDueCustomer] = useState([]);
  const [refetch, setRefetch] = useState(false);
  useEffect(() => {
    axios
      .get("https://home-store-backend.vercel.app/api/shop/customer/due")
      .then((res) => setDueCustomer(res?.data?.data));
  }, [refetch]);

  console.log(dueCustomer);
  // customer add handle.
  const [waiting, setWaiting] = useState(false);
  const dueCustomerAddHandle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data: tDueCustomer = {
      name: form.customerName.value,
      address: form.address.value,
    };
    if (form.phone.value) {
      data.phone = form.phone.value;
    }
    setWaiting(true);
    axios
      .post("https://home-store-backend.vercel.app/api/shop/due/create-customer", data)
      .then((res) => {
        if (res.data.statusCode === 200) {
          form.reset();
          setWaiting(false);
          setRefetch((p) => !p);
          toast.success("নতুন বকেয়া ক্রেতা যুক্ত হয়েছে ।");
        }
      });
  };
  const move = useNavigate();
  return (
    <div>
      <div className="flex items-center gap-x-5 px-5 sticky z-10 top-6 pt-6 pb-4 bg-white">
        <button
          onClick={onOpen}
          className="bg-gray-800 text-white py-3 px-5 rounded-md w-full flex items-center justify-center gap-2"
        >
          <Plus height={30} width={30} /> নতুন ক্রেতা যুক্ত করুন
        </button>
      </div>

      <div className="flex flex-col relative   gap-2">
        {dueCustomer
          ? (
              dueCustomer as {
                _id: string;
                name: string;
                address: string;
                phone?: string;
              }[]
            ).map(
              (
                item: {
                  _id: string;
                  name: string;
                  address: string;
                  phone?: string;
                },
                idx: number
              ) => (
                <button
                  onClick={() => move(`due-customer/${item._id}`)}
                  className=" gap-2 rounded-md w-full bg-gray-200 py-2 flex justify-between items-center"
                >
                  <span className="w-[50px] ">{++idx}</span>
                  {/* <img
                  className="w-[80px] object-cover h-[50px] rounded-md"
                  src={item.image}
                  alt=""
                /> */}
                  <span className=" w-[200px]  overflow-hidden">
                    {item.name} ({item.address})
                  </span>
                  <span className="w-[100px] text-xl font-bold ">{0}/=</span>
                </button>
              )
            )
          : ""}
      </div>

      {/* modal. */}
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center text-xl font-semibold">
                বকেয়া ক্রেতার তথ্য দিন
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={dueCustomerAddHandle}
                  className="flex flex-col gap-3"
                >
                  <input
                    required
                    name="customerName"
                    className="w-full border-2 border-gray-300 focus:outline-green-600 font-medium text-lg py-2 pl-1 rounded-md"
                    type="text"
                    placeholder="ক্রেতার নাম"
                  />
                  <input
                    required
                    name="address"
                    className="w-full border-2 border-gray-300 focus:outline-green-600 font-medium text-lg py-2 pl-1 rounded-md"
                    type="text"
                    placeholder="ক্রেতার ঠিকানা"
                  />
                  <input
                    name="phone"
                    className="w-full border-2 border-gray-300 focus:outline-green-600 font-medium text-lg py-2 pl-1 rounded-md"
                    type="text"
                    placeholder="ক্রেতার মোবাইল নাম্বার (যদি থাকে)"
                  />
                  <button
                    disabled={waiting}
                    className="bg-green-400 rounded-md py-2 text-white text-2xl font-bold"
                  >
                    {waiting ? "অপেক্ষা করুন" : "Ok"}
                  </button>
                </form>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DueCustomer;
