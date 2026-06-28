import { useEffect, useState } from "react";
import { Package, Search, Loader2, AlertCircle } from "lucide-react";

import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";
import { getAllComponents } from "../../services/componentApi";

export default function ComponentInventory() {
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = components.filter((component) =>
      component.component_name.toLowerCase().includes(search.toLowerCase()),
    );

    setFilteredComponents(filtered);
  }, [search, components]);

  if (loading) {
    return (
      <GroupLeaderLayout>
        <div className="min-h-screen flex items-center justify-center text-[#dae2fd]">
          <Loader2 className="animate-spin mr-3 text-cyan-400" />
          Loading Components...
        </div>
      </GroupLeaderLayout>
    );
  }

  if (error) {
    return (
      <GroupLeaderLayout>
        <div className="p-8">
          <div className="bg-[#171f33] border border-red-500/30 rounded-xl p-6 flex items-center gap-3">
            <AlertCircle className="text-red-400" />
            <p className="text-white">{error}</p>
          </div>
        </div>
      </GroupLeaderLayout>
    );
  }

  return  (
  <GroupLeaderLayout>
    <div className="w-full min-w-0 bg-[#0b1326] text-white px-4 py-6 sm:px-6 lg:px-8">

      {/* Header */}

      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-mono">
          Component Inventory
        </p>

        <h1 className="mt-2 text-2xl sm:text-3xl font-bold">
          Lab Components
        </h1>

        <p className="mt-2 text-sm sm:text-base text-slate-400">
          Browse available lab components.
        </p>
      </div>

      {/* Search */}

      <div className="relative mb-8 w-full max-w-md">
        <Search
          size={18}
          className="absolute left-4 top-3.5 text-slate-500"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Components..."
          className="
            w-full
            h-12
            rounded-xl
            bg-[#171f33]
            border
            border-[#3c494c]
            pl-11
            pr-4
            text-white
            outline-none
            focus:border-cyan-400
          "
        />
      </div>

      {/* Cards */}

      <div
        className="
          grid
          gap-6
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        "
      >
        {filteredComponents.map((component) => (
          <div
            key={component.component_id}
            className="
              rounded-xl
              border
              border-[#3c494c]
              bg-[#171f33]
              p-5
              hover:border-cyan-400
              transition
              flex
              flex-col
              justify-between
            "
          >
            <div>
              <Package
                className="mb-4 text-cyan-400"
                size={36}
              />

              <h2 className="text-lg font-semibold break-words">
                {component.component_name}
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                {component.category}
              </p>

              <p className="mt-3 text-sm text-slate-500 line-clamp-3">
                {component.description}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <span
                className={`font-semibold ${
                  component.available_quantity > 0
                    ? "text-cyan-400"
                    : "text-red-400"
                }`}
              >
                {component.available_quantity > 0
                  ? `Stock: ${component.available_quantity}`
                  : "Out of Stock"}
              </span>

              <button
                disabled={component.available_quantity === 0}
                className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                  component.available_quantity > 0
                    ? "bg-cyan-400 hover:bg-cyan-300 text-[#00363e]"
                    : "bg-slate-700 text-slate-400 cursor-not-allowed"
                }`}
              >
                {component.available_quantity > 0
                  ? "Add"
                  : "Unavailable"}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  </GroupLeaderLayout>
);
}
