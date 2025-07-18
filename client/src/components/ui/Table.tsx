import React from 'react';

interface TableProps {
  columns: { key: string; label: string }[];
  data: Record<string, any>[];
  className?: string;
}

export const Table: React.FC<TableProps> = ({ columns, data, className }) => {
  return (
    <div
      className={`overflow-x-auto rounded-lg border border-gray-200 ${
        className || ''
      }`}
      dir="auto"
    >
      <table className="min-w-full bg-white text-sm rtl:text-right ltr:text-left">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-2 font-bold text-gray-700 bg-gray-50 border-b"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 text-gray-400"
              >
                لا توجد بيانات
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className="even:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2 border-b">
                    {row[col.key] ?? ''}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
