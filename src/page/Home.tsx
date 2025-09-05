import axios from "axios";
import { useEffect, useState } from "react";
import { tProducts } from "../types";
import { useNavigate } from "react-router-dom";
import { LucideClockArrowDown, Search } from "lucide-react";
import SearchWithBarCode from "../component/BarcodeRelated/SearchWithBarCode";

const ITEMS_PER_PAGE = 20; // Number of products per page

const Home = () => {
  const [products, setProducts] = useState<tProducts[] | null>(null);
  const [searchedStatus, setSearchedStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://home-store-backend.vercel.app/api/shop/find-product")
      .then((res) => setProducts(res.data.data));
  }, []);

  const searchHandle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchTerm = (e.currentTarget.searchTerm as HTMLInputElement).value;
    axios
      .get(
        `https://home-store-backend.vercel.app/api/shop/find-product?searchTerm=${searchTerm}`
      )
      .then((res) => {
        setProducts(res.data.data);
        setSearchedStatus(true);
        setCurrentPage(1); // Reset to first page
      });
  };

  const resetSearch = () => {
    axios
      .get("https://home-store-backend.vercel.app/api/shop/find-product")
      .then((res) => {
        setProducts(res.data.data);
        setSearchedStatus(false);
        setCurrentPage(1);
      });
  };

  // Front-end Pagination
  const totalPages = products ? Math.ceil(products.length / ITEMS_PER_PAGE) : 0;
  const paginatedProducts = products
    ? products.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    )
    : [];

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Search Bar */}
      <form
        onSubmit={searchHandle}
        className="flex flex-col md:flex-row items-center gap-4 md:gap-5 sticky z-10 top-6 bg-white p-4 rounded-lg shadow-md"
      >
        <input
          name="searchTerm"
          type="text"
          placeholder="পন্যের নাম"
          className="flex-1 border border-gray-300 rounded-md py-2 px-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {searchedStatus ? (
          <button
            type="button"
            onClick={resetSearch}
            className="flex items-center gap-2 bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 transition"
          >
            <LucideClockArrowDown className="w-5 h-5" />
            Reset
          </button>
        ) : (
          <button
            type="submit"
            className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
          >
            <Search className="w-5 h-5" />
            খুঁজুন
          </button>
        )}
      </form>

      {/* Barcode Search */}
      <div className="my-6">
        <SearchWithBarCode />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedProducts.map((item) => {
          const isExpired =
            item.expiredDate && new Date(item.expiredDate) < new Date();
          const lowStock = item?.stock !== null && item?.stock as number <= 5 && item?.stock as number > 0;

          return (
            <div
              key={item._id}
              onClick={() => navigate(`product/${item._id}`)}
              className={`${item.barCode ? "bg-white" : "bg-gray-400"
                } rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer flex flex-col`}
            >
              {/* Image */}
              <div className="h-40 w-full overflow-hidden rounded-t-xl">
                <img
                  src={item.image}
                  alt={item.banglaName}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {item.banglaName}
                </h2>
                <p className="text-gray-500 text-sm truncate">{item.englishName}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-green-600 font-bold text-lg">
                    {item.sellingPrice}/=
                  </span>
                  <span
                    className={`text-sm font-medium ${item.stock === 0
                        ? "text-red-500"
                        : lowStock
                          ? "text-yellow-600"
                          : "text-gray-500"
                      }`}
                  >
                    {item.stock === 0
                      ? "Out of stock"
                      : lowStock
                        ? `Low stock: ${item.stock}`
                        : `Stock: ${item.stock||0}`}
                  </span>
                </div>
                {item.expiredDate && (
                  <span
                    className={`text-xs mt-1 font-medium ${isExpired ? "text-red-600" : "text-gray-500"
                      }`}
                  >
                    Exp: {new Date(item.expiredDate).toLocaleDateString()}
                    {isExpired && " (Expired)"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        {paginatedProducts.length === 0 && (
          <p className="text-gray-500 col-span-full text-center mt-10">
            কোনো পণ্য পাওয়া যায়নি।
          </p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 disabled:opacity-50 hover:bg-gray-400 transition"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-md ${page === currentPage
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } transition`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 disabled:opacity-50 hover:bg-gray-400 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
