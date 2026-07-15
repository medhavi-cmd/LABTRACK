import { useEffect, useState } from "react";
import {
  Package,
  Search,
  Loader2,
  AlertCircle,
  ShoppingCart,
} from "lucide-react";
import { addToCart, getCartCount } from "../../utils/cartUtils";
import { useNavigate } from "react-router-dom";
import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";
import { getAllComponents } from "../../services/componentApi";

export default function ComponentInventory() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [components, setComponents] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]);
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
      setFilteredComponents(data);
      setCartCount(getCartCount());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = components.filter((component) =>
      component.component_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredComponents(filtered);
  }, [search, components]);

  if (loading) {
    return (
      <GroupLeaderLayout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-[#dae2fd] gap-3 px-4 text-center">
          <Loader2 className="animate-spin text-cyan-400 h-8 w-8" />
          <p className="text-xs sm:text-sm font-medium tracking-wide">Loading Lab Components...</p>
        </div>
      </GroupLeaderLayout>
    );
  }

  if (error) {
    return (
      <GroupLeaderLayout>
        <div className="p-4 sm:p-8 max-w-3xl mx-auto">
          <div className="bg-[#171f33] border border-red-500/30 rounded-xl p-4 sm:p-6 flex items-start sm:items-center gap-3 shadow-lg">
            <AlertCircle className="text-red-400 shrink-0 mt-0.5 sm:mt-0" size={22} />
            <p className="text-sm sm:text-base text-white font-medium">{error}</p>
          </div>
        </div>
      </GroupLeaderLayout>
    );
  }

  return (
    <GroupLeaderLayout>
      <div className="w-full min-w-0 bg-[#0b1326] text-white px-3 py-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-slate-800/60">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-cyan-400 font-mono font-semibold">
              Component Inventory
            </p>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
              Lab Components
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Browse and request available lab components.
            </p>
          </div>

          <button
            onClick={() => navigate("/student/cart")}
            className="relative self-end sm:self-auto flex items-center gap-2 bg-[#171f33] border border-[#3c494c] p-2.5 sm:px-4 sm:py-2.5 rounded-xl hover:border-cyan-400 hover:text-cyan-400 transition text-sm font-semibold text-white active:scale-[0.98] shadow-md"
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">View Cart</span>
            
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse border border-[#0b1326]">
                {cartCount}
              </span>
            )}
          </button>
        </div>


        <div className="relative mb-6 sm:mb-8 w-full max-w-md">
          <Search
            size={16}
            className="absolute left-4 top-3.5 text-slate-500 pointer-events-none"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search components..."
            className="w-full h-11 rounded-xl bg-[#171f33] border border-[#3c494c] pl-10 pr-4 text-xs sm:text-sm text-white placeholder:text-gray-500 outline-none focus:border-cyan-400 transition-all shadow-inner"
          />
        </div>

        {filteredComponents.length === 0 ? (
          <div className="text-center py-12 bg-[#171f33]/40 border border-slate-800 rounded-2xl p-6">
            <Package className="mx-auto text-slate-600 mb-3" size={40} />
            <p className="text-slate-400 text-sm">No components match your current criteria.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredComponents.map((component) => (
              <div
                key={component.component_id}
                className="rounded-xl border border-[#3c494c] bg-[#171f33] p-4 sm:p-5 hover:border-cyan-400 hover:shadow-cyan-950/20 transition-all duration-200 flex flex-col justify-between shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <Package className="text-cyan-400 group-hover:scale-110 transition-transform duration-200" size={30} />
                    <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-md uppercase tracking-wider font-semibold ${
                      component.available_quantity > 0 
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" 
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      {component.available_quantity > 0 ? "In Stock" : "Unavailable"}
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold break-words leading-snug">
                    {component.component_name}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400 font-medium">
                    {component.category || "Uncategorized"}
                  </p>

                  <p className="mt-2.5 text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {component.description || "No descriptions available for this system asset component."}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-800 flex items-center justify-between gap-3">
                  <span
                    className={`text-xs sm:text-sm font-bold ${
                      component.available_quantity > 0 ? "text-cyan-400" : "text-red-400"
                    }`}
                  >
                    {component.available_quantity > 0
                      ? `Stock: ${component.available_quantity}`
                      : "Out of Stock"}
                  </span>

                  <button
                    disabled={component.available_quantity === 0}
                    onClick={() => {
                      addToCart(component);
                      setCartCount(getCartCount());
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-[0.96] shrink-0 ${
                      component.available_quantity > 0
                        ? "bg-cyan-400 hover:bg-cyan-300 text-[#00363e] shadow-md shadow-cyan-400/10"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50"
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