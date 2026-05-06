import { useEffect, useState } from "react";
import { Search, Check, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL;
const adminId = localStorage.getItem("token");

export default function PermissionMatrix() {
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const token = localStorage.getItem("token");

  // ================= FETCH MATRIX =================
  const fetchMatrix = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/vai-tro-api/matrix`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      console.log("API /vai-tro-api/matrix : ", json);

      const apis = json.data.apis;

      setData(apis);

      // lấy danh sách roles từ API đầu tiên
      if (apis.length > 0) {
        setRoles(apis[0].roles);
      }
    } catch (err) {
      toast.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatrix();
  }, []);

  // ================= UPDATE PERMISSION =================
  const handleToggle = async (roleId, apiId, current) => {
    const key = `${roleId}_${apiId}`;

    try {
      setUpdating((prev) => ({ ...prev, [key]: true }));

      const res = await fetch(
        `${API}/vai-tro-api/update?roleId=${roleId}&apiId=${apiId}&allow=${!current}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();

      console.log("API /vai-tro-api/update : ", json);

      if (!res.ok) throw new Error(json.message);

      // update UI tại chỗ (không cần refetch)
      setData((prev) =>
        prev.map((api) => {
          if (api.apiId !== apiId) return api;

          return {
            ...api,
            roles: api.roles.map((r) =>
              r.roleId === roleId ? { ...r, allow: !current } : r
            ),
          };
        })
      );

      toast.success("Cập nhật quyền thành công");
    } catch (err) {
      toast.error(err.message || "Lỗi cập nhật");
    } finally {
      setUpdating((prev) => ({ ...prev, [key]: false }));
    }
  };

  // ================= FILTER =================
  const filteredData = data.filter(
    (api) =>
      api.name.toLowerCase().includes(search.toLowerCase()) ||
      api.path.toLowerCase().includes(search.toLowerCase())
  );

    useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getMethodStyle = (method) => {
    switch (method) {
      case "GET":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50";
      case "POST":
        return "bg-amber-500/20 text-amber-400 border border-amber-500/50";
      case "PUT":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/50";
      case "DELETE":
        return "bg-rose-500/20 text-rose-400 border border-rose-500/50";
      default:
        return "bg-slate-500/20 text-slate-300 border border-slate-500/50";
    }
  };

  // ================= UI =================
  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4 text-blue-400">
        Permission Matrix
      </h1>

      {/* SEARCH */}
      <div className="flex items-center gap-2 mb-4 bg-slate-800 p-2 rounded-xl w-full max-w-md">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Tìm API..."
          className="bg-transparent outline-none w-full text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* LOADING */}
      {loading ? (   
        <div className="flex justify-center mt-10">
          <Loader2 className="animate-spin" size={40} />
        </div>
      ) : (
        <>
            <div className="overflow-auto border border-slate-700 rounded-xl">
            <table className="w-full text-sm">
                <thead className="bg-slate-800 text-slate-300">
                <tr>
                    <th className="p-3 text-left">#</th>
                    <th className="p-3 text-left">API</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Path</th>

                    {roles.map((r) => (
                    <th key={r.roleId} className="p-3">
                        {r.roleName}
                    </th>
                    ))}
                </tr>
                </thead>

                <tbody>
                {paginatedData.map((api, index) => (
                    <tr
                    key={api.apiId}
                    className="border-t border-slate-700 hover:bg-slate-800 transition"
                    >
                        
                        <td className="p-3 text-slate-400">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>

                    {/* NAME */}
                    <td className="p-3 font-medium text-blue-300">
                        {api.name}
                    </td>

                    {/* METHOD */}
                    <td className="p-3 text-center">
                        <span
                        className={`px-3 py-1 rounded-lg text-xs font-mono ${getMethodStyle(
                            api.method
                        )}`}
                        >
                        {api.method}
                        </span>
                    </td>

                    {/* PATH */}
                    <td className="p-3 text-slate-400">{api.path}</td>

                    {/* ROLES */}
                    {api.roles.map((r) => {
                        const key = `${r.roleId}_${api.apiId}`;
                        const isAdmin = r.roleName === "ADMIN";

                        return (
                        <td key={r.roleId} className="text-center p-3">
                            <button
                            disabled={isAdmin || updating[key]}
                            onClick={() =>
                                handleToggle(r.roleId, api.apiId, r.allow)
                            }
                            className={`p-2 rounded-lg transition
                                ${
                                isAdmin
                                    ? "bg-slate-700 cursor-not-allowed"
                                    : r.allow
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-red-600 hover:bg-red-700"
                                }`}
                            >
                            {updating[key] ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : r.allow ? (
                                <Check size={16} />
                            ) : (
                                <X size={16} />
                            )}
                            </button>
                        </td>
                        );
                    })}
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1 bg-slate-800 rounded-lg hover:bg-slate-700 disabled:opacity-50"
                disabled={currentPage === 1}
                >
                Trước
                </button>

                <span className="text-slate-400 text-sm">
                Trang {currentPage} / {totalPages || 1}
                </span>

                <button
                onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                className="px-3 py-1 bg-slate-800 rounded-lg hover:bg-slate-700 disabled:opacity-50"
                disabled={currentPage === totalPages}
                >
                Sau
                </button>
            </div>
        </>
      )}
    </div>
  );
}