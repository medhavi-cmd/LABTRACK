function DataTable({ columns, data }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#081122]">
      <table className="w-full text-left">
        <thead className="bg-white/5 text-slate-300 text-sm">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-5 py-4 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-white/10">
          {data.map((row, index) => (
            <tr key={index} className="text-sm text-slate-300 hover:bg-white/5">
              {columns.map((column) => (
                <td key={column} className="px-5 py-4">
                  {row[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export default DataTable;