function DataTable({ columns, data }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-[#F8FAFC] text-[#4B5563] text-sm">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-5 py-4 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-[#E5E7EB]">
          {data.map((row, index) => (
            <tr key={index} className="text-sm text-[#4B5563] hover:bg-[#F8FAFC]">
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