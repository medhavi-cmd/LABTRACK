import { useEffect, useState, useMemo } from "react";
import { Package, Search, Loader2, AlertCircle, ShoppingCart } from "lucide-react";
import { addToCart, getCartCount } from "../../utils/cartUtils";
import { useNavigate } from "react-router-dom";
import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";
import { getAllComponents } from "../../services/componentApi";

export default function ComponentInventory() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllComponents();
      setComponents(data);
      setCartCount(getCartCount());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredComponents = useMemo(() => {
    return components.filter((component) =>
      component.component_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, components]);

  if (loading) {
    return (
      <GroupLeaderLayout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-600 gap-3 px-4 text-center">
          <Loader2 className="animate-spin text-cyan-600 h-8 w-8" />
          <p className="text-xs sm:text-sm font-medium tracking-wide">Loading Lab Components...</p>
        </div>
      </GroupLeaderLayout>
    );
  }

  if (error) {
    return (
      <GroupLeaderLayout>
        <div className="p-4 sm:p-8 max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 flex items-start sm:items-center gap-3 shadow-sm">
            <AlertCircle className="text-red-600 shrink-0 mt-0.5 sm:mt-0" size={22} />
            <p className="text-sm sm:text-base text-red-800 font-medium">{error}</p>
          </div>
        </div>
      </GroupLeaderLayout>
    );
  }

  return (
    <GroupLeaderLayout>
      <div className="w-full min-w-0 bg-slate-50 text-slate-600 px-3 py-4 sm:px-6 lg:px-8 min-h-screen">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-cyan-600 font-mono font-bold">
              Component Inventory
            </p>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Lab Components
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Browse and request available lab components.
            </p>
          </div>

          <button
            onClick={() => navigate("/student/cart")}
            className="relative self-end sm:self-auto flex items-center gap-2 bg-white border border-slate-200 p-2.5 sm:px-4 sm:py-2.5 rounded-xl hover:border-cyan-500 hover:text-cyan-600 transition text-sm font-semibold text-slate-700 active:scale-[0.98] shadow-sm"
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">View Cart</span>
            
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse border border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        <div className="relative mb-6 sm:mb-8 w-full max-w-md">
          <Search size={16} className="absolute left-4 top-3.5 text-slate-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search components..."
            className="w-full h-11 rounded-xl bg-white border border-slate-200 pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-cyan-500 transition-all shadow-sm"
          />
        </div>

        {filteredComponents.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <Package className="mx-auto text-slate-300 mb-3" size={40} />
            <p className="text-slate-500 text-sm">No components match your current criteria.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredComponents.map((component) => (
              <div
                key={component.component_id}
                className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 hover:border-cyan-500 transition-all duration-200 flex flex-col justify-between shadow-sm group hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <Package className="text-cyan-600 group-hover:scale-110 transition-transform duration-200" size={30} />
                    <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-md uppercase tracking-wider font-semibold ${
                      component.available_quantity > 0 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}>
                      {component.available_quantity > 0 ? "In Stock" : "Unavailable"}
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold break-words leading-snug text-slate-900">
                    {component.component_name}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    {component.category || "Uncategorized"}
                  </p>

                  <p className="mt-2.5 text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {component.description || "No descriptions available for this system asset component."}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className={`text-xs sm:text-sm font-bold ${component.available_quantity > 0 ? "text-slate-900" : "text-red-600"}`}>
                    {component.available_quantity > 0 ? `Stock: ${component.available_quantity}` : "Out of Stock"}
                  </span>

                  <button
                    disabled={component.available_quantity === 0}
                    onClick={() => {
                      addToCart(component);
                      setCartCount(getCartCount());
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-[0.96] shrink-0 ${
                      component.available_quantity > 0
                        ? "bg-[#2563EB] hover:bg-[#1d4ed8] text-white shadow-sm"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                    }`}
                  >
                    {component.available_quantity > 0 ? "Add to Cart" : "Unavailable"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </GroupLeaderLayout>
  );
}