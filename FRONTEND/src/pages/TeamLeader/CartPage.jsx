import { useEffect, useState } from "react";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";
import { submitRequest } from "../../services/studentRequestApi";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  };

  const saveCart = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const increaseQty = (id) => {
    const updated = cart.map((item) => {
      if (item.component_id === id) {
        if (item.quantity < item.available_quantity) {
          item.quantity += 1;
        }
      }
      return item;
    });
    saveCart([...updated]);
  };

  const decreaseQty = (id) => {
    let updated = cart.map((item) => {
      if (item.component_id === id) {
        item.quantity -= 1;
      }
      return item;
    });
    updated = updated.filter((item) => item.quantity > 0);
    saveCart(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item.component_id !== id);
    saveCart(updated);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmit = async () => {
    try {
      await submitRequest("Project Components", cart);
      alert("Request Submitted Successfully");
      localStorage.removeItem("cart");
      navigate("/student/student-dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <GroupLeaderLayout>
      <div className="max-w-4xl mx-auto px-3 py-4 sm:px-6 sm:py-8 min-h-[85vh] text-white">
        

        <div className="flex flex-row items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <ShoppingCart className="text-cyan-400 h-5 w-5 sm:h-7 sm:w-7" />
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight">
              My Cart
            </h1>
          </div>

          <button
            onClick={() => navigate("/student/component-inventory")}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-[#171f33] px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400 active:scale-[0.98]"
          >
            <ArrowLeft size={16} />
            <span>Back<span className="hidden sm:inline"> to Inventory</span></span>
          </button>
        </div>

    
        {cart.length === 0 ? (
          <div className="bg-[#171f33]/60 border border-slate-800 rounded-2xl p-8 sm:p-16 text-center shadow-xl">
            <ShoppingBag className="mx-auto text-slate-600 mb-4 h-10 w-10 sm:h-12 sm:w-12" />
            <h2 className="text-base sm:text-xl font-bold text-slate-200">
              Your cart is empty
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-xs mx-auto">
              Explore our laboratory repository inventory to request equipment items.
            </p>
            <button
              onClick={() => navigate("/student/component-inventory")}
              className="mt-5 bg-cyan-400 hover:bg-cyan-300 text-[#00363e] text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition active:scale-[0.97]"
            >
              Browse Inventory
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            
    
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.component_id}
                  className="bg-[#171f33] rounded-xl border border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-slate-700 transition duration-150 shadow-md"
                >
                  <div className="space-y-1 min-w-0">
                    <h2 className="text-sm sm:text-base font-bold tracking-wide text-white truncate">
                      {item.component_name}
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                      {item.category || "Uncategorized"}
                    </p>
                    <p className="text-xs text-cyan-400/90 font-mono pt-1">
                      Available Stock: {item.available_quantity}
                    </p>
                  </div>

           
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t border-slate-800/80 sm:border-t-0">
                    <div className="flex items-center bg-[#0b1326] rounded-xl p-1 border border-slate-800">
                      <button
                        onClick={() => decreaseQty(item.component_id)}
                        className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                      >
                        <Minus size={14} sm:size={16} />
                      </button>
                      
                      <span className="text-sm sm:text-base font-bold font-mono w-9 text-center">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => increaseQty(item.component_id)}
                        disabled={item.quantity >= item.available_quantity}
                        className="p-1.5 sm:p-2 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <Plus size={14} sm:size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.component_id)}
                      className="p-2.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition active:scale-[0.95]"
                      title="Remove component row"
                    >
                      <Trash2 size={16} sm:size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#171f33] border border-slate-800 rounded-xl p-4 sm:p-6 shadow-xl">
              <div className="flex sm:flex-col justify-between items-center sm:items-start w-full sm:w-auto pb-2 sm:pb-0 border-b border-slate-800 sm:border-b-0">
                <h2 className="text-xs sm:text-sm font-semibold tracking-wider text-slate-400 uppercase">
                  Total Items
                </h2>
                <p className="text-xl sm:text-3xl font-bold font-mono text-cyan-400">
                  {totalItems}
                </p>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full sm:w-auto bg-cyan-400 hover:bg-cyan-300 text-[#00363e] font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition shadow-md shadow-cyan-400/10 active:scale-[0.98]"
              >
                Submit Request
              </button>
            </div>
            
          </div>
        )}
      </div>
    </GroupLeaderLayout>
  );
}