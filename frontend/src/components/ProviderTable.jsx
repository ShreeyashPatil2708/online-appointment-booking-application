function ProviderTable({ providers, onDeactivate, onActivate }) {
  if (!providers || providers.length === 0) {
    return <p className="text-center text-gray-500 py-8">No providers found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['Name', 'Specialty', 'Rating', 'Status', 'Actions'].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {providers.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.name}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{p.specialty}</td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {p.averageRating?.toFixed(1) || 'N/A'}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {p.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-4 py-3 flex gap-2">
                {p.isActive && onDeactivate && (
                  <button
                    onClick={() => onDeactivate(p.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Deactivate
                  </button>
                )}
                {!p.isActive && onActivate && (
                  <button
                    onClick={() => onActivate(p.id)}
                    className="text-xs text-green-600 hover:underline"
                  >
                    Activate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProviderTable;
