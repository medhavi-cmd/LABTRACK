import { useEffect, useState } from "react";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";

export default function CartPage() {
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
    const updated = cart.filter(
      (item) => item.component_id !== id
    );

    saveCart(updated);
  };

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleSubmit = () => {
    alert("Next step: Save request in database.");
  };

  return (
    <GroupLeaderLayout>
      <div className="min-h-screen bg-[#0b1326] text-white p-8">

        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="text-cyan-400" />
          <h1 className="text-3xl font-bold">
            My Cart
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="bg-[#171f33] rounded-xl p-8 text-center">
            <h2 className="text-xl font-semibold">
              Cart is Empty
            </h2>

            <p className="text-slate-400 mt-2">
              Add some components first.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-5">

              {cart.map((item) => (

                <div
                  key={item.component_id}
                  className="bg-[#171f33] rounded-xl border border-[#3c494c] p-5 flex justify-between items-center"
                >

                  <div>

                    <h2 className="text-lg font-semibold">
                      {item.component_name}
                    </h2>

                    <p className="text-slate-400">
                      {item.category}
                    </p>

                    <p className="text-cyan-400 mt-2">
                      Available :
                      {" "}
                      {item.available_quantity}
                    </p>

                  </div>

                  <div className="flex items-center gap-3">

                    <button
                      onClick={() =>
                        decreaseQty(item.component_id)
                      }
                      className="bg-slate-700 p-2 rounded"
                    >
                      <Minus size={18} />
                    </button>

                    <span className="text-lg font-bold w-8 text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQty(item.component_id)
                      }
                      className="bg-cyan-400 text-[#00363e] p-2 rounded"
                    >
                      <Plus size={18} />
                    </button>

                    <button
                      onClick={() =>
                        removeItem(item.component_id)
                      }
                      className="bg-red-500 ml-5 p-2 rounded"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                </div>

              ))}

            </div>

            <div className="mt-8 flex justify-between items-center bg-[#171f33] rounded-xl p-6">

              <div>

                <h2 className="text-xl font-semibold">
                  Total Items
                </h2>

                <p className="text-cyan-400 text-2xl font-bold">
                  {totalItems}
                </p>

              </div>

              <button
                onClick={handleSubmit}
                className="bg-cyan-400 hover:bg-cyan-300 text-[#00363e] font-semibold px-6 py-3 rounded-lg"
              >
                Submit Request
              </button>

            </div>
          </>
        )}

      </div>
    </GroupLeaderLayout>
  );
}