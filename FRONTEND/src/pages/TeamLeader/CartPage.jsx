import {toast} from "sonner";
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
      toast.success("Request Submitted Successfully");
      localStorage.removeItem("cart");
      navigate("/student/student-dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <GroupLeaderLayout>
      <div className="min-h-screen bg-[#F8FAFC] text-[#4B5563] p-5 sm:p-8 font-sans">
        
        <div className="max-w-4xl mx-auto flex flex-row items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="rounded-lg border border-[#2563EB]/20 bg-[#EFF6FF] p-2 text-[#2563EB]">
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#2563EB]">
                Inventory Request
              </p>
              <h1 className="text-xl sm:text-2xl font-bold text-[#111827] mt-0.5">
                My Cart
              </h1>
            </div>
          </div>

          <button
            onClick={() => navigate("/student/component-inventory")}
            className="flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-[#4B5563] transition hover:border-[#2563EB] hover:text-[#2563EB] shadow-[0_1px_2px_rgba(0,0,0,0.05)] active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back<span className="hidden sm:inline"> to Inventory</span></span>
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          {cart.length === 0 ? (
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-8 sm:p-16 text-center shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <ShoppingBag className="mx-auto text-slate-400 mb-4 h-10 w-10 sm:h-12 sm:w-12" />
              <h2 className="text-base sm:text-xl font-bold text-[#111827]">
                Your cart is empty
              </h2>
              <p className="text-[#6B7280] text-xs sm:text-sm mt-1.5 max-w-xs mx-auto">
                Explore our laboratory repository inventory to request equipment items.
              </p>
              <button
                onClick={() => navigate("/student/component-inventory")}
                className="mt-5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition active:scale-[0.97] shadow-sm"
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
                    className="bg-[#FFFFFF] rounded-xl border border-[#E5E7EB] p-4 sm:p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-slate-300 transition duration-150 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                  >
                    <div className="space-y-1 min-w-0">
                      <h2 className="text-sm sm:text-base font-bold text-[#111827] truncate">
                        {item.component_name}
                      </h2>
                      <p className="text-xs text-[#6B7280] font-medium">
                        {item.category || "Uncategorized"}
                      </p>
                      <p className="text-xs text-cyan-700 font-mono pt-1">
                        Available Stock: {item.available_quantity}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t border-[#E5E7EB] sm:border-t-0">
                      <div className="flex items-center bg-[#F8FAFC] rounded-xl p-1 border border-[#E5E7EB]">
                        <button
                          onClick={() => decreaseQty(item.component_id)}
                          className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-slate-200 rounded-lg transition"
                        >
                          <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>
                        
                        <span className="text-sm sm:text-base font-bold font-mono w-9 text-center text-[#111827]">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => increaseQty(item.component_id)}
                          disabled={item.quantity >= item.available_quantity}
                          className="p-1.5 text-[#2563EB] hover:text-blue-700 hover:bg-slate-200 rounded-lg transition disabled:opacity-30 disabled:pointer-events-none"
                        >
                          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.component_id)}
                        className="p-2.5 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition active:scale-[0.95]"
                        title="Remove component row"
                      >
                        <Trash2 className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-4 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                <div className="flex sm:flex-col justify-between items-center sm:items-start w-full sm:w-auto pb-2 sm:pb-0 border-b border-[#E5E7EB] sm:border-b-0">
                  <h2 className="text-xs sm:text-sm font-semibold tracking-wider text-[#6B7280] uppercase">
                    Total Items
                  </h2>
                  <p className="text-xl sm:text-3xl font-bold font-mono text-[#2563EB]">
                    {totalItems}
                  </p>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full sm:w-auto bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition shadow-sm active:scale-[0.98]"
                >
                  Submit Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </GroupLeaderLayout>
  );
}