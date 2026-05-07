import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  AlertTriangle,
  Check,
  Truck,
  X,
  Eye,
  Search,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAYMENT_TABS = [
  { label: "Tất cả", value: "ALL" },
  { label: "Xác nhận thanh toán", value: "XAC_NHAN_THANH_TOAN" },
  { label: "Đóng gói", value: "XAC_NHAN_LAY_HANG" },
  { label: "Giao hàng", value: "XAC_NHAN_GIAO_HANG" },
  { label: "Đang giao", value: "DANG_GIAO" },
  { label: "Hoàn thành", value: "HOAN_THANH" },
  { label: "Đã hủy", value: "DA_HUY" },
];

export default function SellerOrders() {
    const token = localStorage.getItem("token");
    const API = import.meta.env.VITE_API_URL;

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    // API trong fetchOrders sẽ nhận các query params sau:
    // - tabStatus: ALL | CHO_XAC_NHAN | CHO_LAY_HANG | DANG_GIAO | DA_GIAO | DA_HUY
    // - processingType: ALL | DA_XU_LY | CHUA_XU_LY
    // - keyword: chuỗi tìm kiếm (theo mã đơn hoặc tên khách)
    const [tabStatus, setTabStatus] = useState("ALL");
    const [processingType, setProcessingType] = useState("ALL");
    const [keyword, setKeyword] = useState("");
    
    const [approveLoading, setApproveLoading] = useState(null);

    // modal state
    const [cancelModal, setCancelModal] = useState(null);
    const [shipModal, setShipModal] = useState(null);

    const [cancelReason, setCancelReason] = useState("");
    const [carrier, setCarrier] = useState("GHTK");
    const [tracking, setTracking] = useState("");

    const [actionLoading, setActionLoading] = useState(false);

    const [billModal, setBillModal] = useState(null);

    const [currentPage, setCurrentPage] = useState(0); // Spring Boot bắt đầu từ 0
    const [totalPages, setTotalPages] = useState(0);

    // ===== FETCH =====
    const fetchOrders = async () => {
        setLoading(true);
        try {
            console.log("API: ", `${API}/seller/orders?tabStatus=${tabStatus}&processingType=${processingType}&keyword=${keyword}&page=${currentPage}&size=10`);
        const res = await fetch(
            `${API}/seller/orders?tabStatus=${tabStatus}&processingType=${processingType}&keyword=${keyword}&page=${currentPage}&size=10`,
            {
            headers: { Authorization: `Bearer ${token}` },
            }
        );
        const json = await res.json();
        console.log("Orders fetched: ", json);
        setOrders(json.data?.content || []);
        setTotalPages(json.data?.totalPages || 0);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [tabStatus, processingType, currentPage]);

    useEffect(() => {
        const t = setTimeout(fetchOrders, 400);
        return () => clearTimeout(t);
    }, [keyword]);

    // ===== ACTIONS =====
    // Xác nhận đã đóng gói, chuẩn bị giao hàng
    const approveOrder = async (id) => {
        setApproveLoading(id);

        try {
            const res = await fetch(`${API}/seller/orders/${id}/approve`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();
            console.log("API response approve:", data);

            if (!res.ok) {
                console.log("API error response:", data);
                throw {
                    message: data?.data,
                    errorCode: data?.message,
                    raw: data,
                };
            }

            toast.success("Duyệt đơn thành công 🎉");
            await fetchOrders();

        } catch (err) {
            console.log("ERROR UI:", err);

            toast.error(
                err?.message ||
                err?.errorCode ||
                err?.raw?.data ||
                "Lỗi duyệt đơn"
            );
        } finally {
            setApproveLoading(null);
        }
    };

    // Giao hàng (tạo vận đơn với thông tin đơn vị vận chuyển và mã vận đơn)
    const submitShip = async () => {
    if (!carrier || !tracking.trim()) {
        alert("Vui lòng nhập đầy đủ thông tin vận chuyển");
        return;
    }

    try {
        setActionLoading(true);

        console.log("API: ", `${API}/seller/orders/${shipModal}/ship`);
        await fetch(`${API}/seller/orders/${shipModal}/ship`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            carrier,
            trackingNumber: tracking,
        }),
        });

        alert("Đã gửi hàng thành công 🚚");

        // reset
        setShipModal(null);
        setTracking("");
        setCarrier("GHTK");

        fetchOrders();
    } catch (err) {
        console.error(err);
        alert("Có lỗi xảy ra");
    } finally {
        setActionLoading(false);
    }
    };

    // Hủy đơn, gửi lý do hủy về backend
    const submitCancel = async () => {
    if (!cancelReason.trim()) {
        alert("Vui lòng nhập lý do hủy đơn");
        return;
    }

    try {
        setActionLoading(true);

        console.log("API: ", `${API}/seller/orders/${cancelModal}/cancel`);
        await fetch(`${API}/seller/orders/${cancelModal}/cancel`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: cancelReason }),
        });

        alert("Đã hủy đơn thành công ✨");

        // reset
        setCancelModal(null);
        setCancelReason("");

        fetchOrders();
    } catch (err) {
        console.error(err);
        alert("Có lỗi xảy ra");
    } finally {
        setActionLoading(false);
    }
    };

    // ===== UTIL =====
    const formatVND = (v) =>
        new Intl.NumberFormat("vi-VN").format(v) + " đ";

    const isNearDeadline = (d) => {
        const diff = new Date(d) - new Date();
        return diff < 24 * 60 * 60 * 1000;
    };

    // ===== STATUS STYLE =====
    const orderStatusStyle = (s) => {
        switch (s) {
        case "CHO_XAC_NHAN":
            return "bg-[#F4E1D2] text-[#C58971]";
        case "CHO_LAY_HANG":
            return "bg-yellow-100 text-yellow-700";
        case "DANG_GIAO":
            return "bg-orange-100 text-yellow-700";
        case "CHO_GIAO_HANG":
            return "bg-[#E6F0EB] text-[#8DA399]";
        case "DA_GIAO":
            return "bg-green-100 text-green-700";
        case "DA_HUY":
            return "bg-red-100 text-red-600";
        default:
            return "bg-gray-100";
        }
    };

    // Xác nhận đã nhận được tiền từ khách, cập nhật trạng thái thanh toán của đơn hàng
    const confirmPayment = async (id) => {
        setActionLoading(true);

        try {
            const res = await fetch(`${API}/payment/${id}/confirm-payment`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();
            console.log("API response:", data);

            // ❗ Backend bạn trả lỗi trong JSON nên phải check tay
            if (!res.ok) {
                throw {
                    message: data?.data || data?.message || "Có lỗi xảy ra",
                    errorCode: data?.message,
                    raw: data,
                };
            }

            toast.success("Xác nhận thanh toán thành công");
            setBillModal(null);
            await fetchOrders();

        } catch (err) {
            console.log("ERROR UI:", err);

            toast.error(
                err?.message ||
                err?.raw?.data ||
                err?.errorCode ||
                "Có lỗi xảy ra"
            );
        } finally {
            setActionLoading(false);
        }
    };

    // Mỗi khi Tab hoặc Keyword thay đổi, ép trang về 0 trước khi Fetch
    useEffect(() => {
        setCurrentPage(0);
    }, [tabStatus, processingType, keyword]);

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-6 text-[#2E2E2E]">
            <Toaster position="top-right" reverseOrder={false} />
            {/* HEADER */}
            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-semibold">Đơn hàng</h1>

                <div className="flex gap-3">
                <div className="flex items-center bg-white px-3 py-2 rounded-xl">
                    <Search size={16} />
                    <input
                    className="ml-2 outline-none text-sm"
                    placeholder="Tìm..."
                    value={keyword}
                    onChange={(e) => {
                        setKeyword(e.target.value)
                        setCurrentPage(0)
                    }}
                    />
                </div>

                <div className="flex gap-2 mb-4">
                    {PAYMENT_TABS.map((t) => (
                        <button
                        key={t.value}
                        onClick={() => setProcessingType(t.value)}
                        className={`px-4 py-2 rounded-xl text-sm ${
                            processingType === t.value
                            ? "bg-[#2E2E2E] text-white"
                            : "bg-white"
                        }`}
                        >
                        {t.label}
                        </button>
                    ))}
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl overflow-hidden">
                {loading ? (
                <div className="p-10 text-center">Loading...</div>
                ) : orders.length === 0 ? (
                <div className="p-10 text-center text-gray-400 flex flex-col items-center">
                    <Package size={40} />
                    <p>Chưa có đơn hàng nào, Nàng ơi!</p>
                </div>
                ) : (
                <table className="w-full text-sm">
                    <thead className="bg-[#FAF7F2]">
                    <tr>
                        <th className="p-4 text-left">Sản phẩm</th>
                        <th className="text-center">Khách</th>
                        <th className="text-center">Hạn</th>
                        <th className="text-center">Tiền</th>
                        <th className="text-center">Trạng thái</th>
                        <th className="text-center">Thao tác</th>
                    </tr>
                    </thead>

                    <tbody>
                    <AnimatePresence>
                        {orders.map((o) => (
                        <motion.tr
                            key={o.orderId}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`border-t ${
                            o.isProcessed ? "opacity-60" : ""
                            }`}
                        >
                            {/* PRODUCT */}
                            <td className="p-4 flex items-center gap-3">
                            <img
                                src={o.items?.[0]?.productImage}
                                className="w-12 h-12 rounded-xl"
                            />
                            <div>
                                <p>{o.items?.[0]?.productName}</p>
                                <p className="text-xs text-gray-400">
                                #{o.orderCode}
                                </p>
                            </div>
                            </td>

                            <td className="text-center px-2">
                            {o.buyerName}
                            <p className="text-xs text-gray-400">
                                {o.buyerPhone}
                            </p>
                            </td>

                            <td className="px-2">
                            <div className="flex items-center justify-center gap-1">
                                {isNearDeadline(o.shippingDeadline) && (
                                <AlertTriangle className="text-red-500" size={14} />
                                )}
                                <span className="text-center">
                                {new Date(o.shippingDeadline).toLocaleString()}
                                </span>
                            </div>
                            </td>

                            <td className="text-center font-medium px-2">{formatVND(o.totalAmount)}</td>

                            {/* ===== STATUS ===== */}
                            <td className="px-2">
                            <div className="flex flex-col items-center justify-center gap-1">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${orderStatusStyle(o.orderStatus)}`}>
                                {o.orderStatus}
                                </span>

                                <span
                                className={`px-2 py-[2px] text-[10px] rounded-full w-fit ${
                                    o.paymentStatus === "DA_THANH_TOAN"
                                    ? "bg-teal-100 text-teal-600"
                                    : "bg-gray-100 text-gray-400"
                                }`}
                                >
                                {o.paymentStatus}
                                </span>
                            </div>
                            </td>

                            {/* ===== ACTION ===== */}
                            <td className="px-4">

                                {/* XAC_NHAN_THANH_TOAN */}
                                {processingType === "XAC_NHAN_THANH_TOAN" && (
                                    <button
                                        onClick={() => 
                                            setBillModal(o.billImages)
                                        }
                                        className="bg-[#8DA399] text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap"
                                    >
                                    Kiểm tra Bill
                                    </button>
                                )}

                                {/* XAC_NHAN_LAY_HANG */}
                                {processingType === "XAC_NHAN_LAY_HANG" && (
                                    <button
                                    onClick={() => approveOrder(o.orderId)}
                                    className="bg-[#C58971] text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap"
                                    >
                                    Xác nhận đóng gói
                                    </button>
                                )}

                                {/* XAC_NHAN_GIAO_HANG */}
                                {processingType === "XAC_NHAN_GIAO_HANG" && (
                                    <button
                                    onClick={() => setShipModal(o.orderId)}
                                    className="bg-[#C58971] text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1 whitespace-nowrap"
                                    >
                                    <Truck size={14} />
                                    Giao hàng
                                    </button>
                                )}
                            </td>
                        </motion.tr>
                        ))}
                    </AnimatePresence>
                    </tbody>

                    {/* PAGINATION CONTROLS*/}
                    {totalPages > 1 && (
                        <tfoot className="bg-[#FAF7F2] border-t">
                            <tr>
                                <td colSpan={6} className="p-4">
                                    <div className="flex items-center justify-center gap-3">
                                        <button
                                            disabled={currentPage === 0}
                                            onClick={() => setCurrentPage(prev => prev - 1)}
                                            className="p-2 rounded-lg hover:bg-white disabled:opacity-30 transition-all shadow-sm border"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>

                                        <div className="flex gap-1">
                                            {[...Array(totalPages)].map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentPage(index)}
                                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                                                        currentPage === index
                                                            ? "bg-[#2E2E2E] text-white shadow-md"
                                                            : "bg-white border hover:bg-stone-100"
                                                    }`}
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            disabled={currentPage === totalPages - 1}
                                            onClick={() => setCurrentPage(prev => prev + 1)}
                                            className="p-2 rounded-lg hover:bg-white disabled:opacity-30 transition-all shadow-sm border"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
                )}
            </div>

            {/* ===== CANCEL MODAL ===== */}
            <AnimatePresence>
            {cancelModal && (
                <motion.div
                className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCancelModal(null)} // click outside
                >
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-3xl shadow-2xl p-6 w-[400px]"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                >
                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">Hủy đơn hàng</h3>
                    <button onClick={() => setCancelModal(null)}>
                        <X size={18} />
                    </button>
                    </div>

                    {/* TEXTAREA */}
                    <textarea
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm outline-none focus:border-[#C58971]"
                    placeholder="Nhập lý do hủy đơn..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    />

                    {/* ACTION */}
                    <div className="flex justify-end gap-2 mt-5">
                    <button
                        onClick={() => setCancelModal(null)}
                        className="px-4 py-2 text-sm"
                    >
                        Đóng
                    </button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={submitCancel}
                        disabled={actionLoading}
                        className="bg-[#E8B4B8] text-white px-4 py-2 rounded-xl text-sm disabled:opacity-50"
                    >
                        {actionLoading ? "Đang xử lý..." : "Xác nhận hủy"}
                    </motion.button>
                    </div>
                </motion.div>
                </motion.div>
            )}
            </AnimatePresence>

            {/* ===== SHIP MODAL ===== */}
            <AnimatePresence>
            {shipModal && (
                <motion.div
                className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShipModal(null)}
                >
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-3xl shadow-2xl p-6 w-[400px]"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                >
                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">Giao hàng</h3>
                    <button onClick={() => setShipModal(null)}>
                        <X size={18} />
                    </button>
                    </div>

                    {/* SELECT */}
                    <select
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 mb-3 text-sm outline-none focus:border-[#C58971]"
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    >
                    <option value="GHTK">GHTK</option>
                    <option value="GHN">GHN</option>
                    <option value="Viettel Post">Viettel Post</option>
                    </select>

                    {/* INPUT */}
                    <input
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm outline-none focus:border-[#C58971]"
                    placeholder="Nhập mã vận đơn..."
                    value={tracking}
                    onChange={(e) => setTracking(e.target.value)}
                    />

                    {/* ACTION */}
                    <div className="flex justify-end gap-2 mt-5">
                    <button
                        onClick={() => setShipModal(null)}
                        className="px-4 py-2 text-sm"
                    >
                        Đóng
                    </button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={submitShip}
                        disabled={actionLoading}
                        className="bg-[#C58971] text-white px-4 py-2 rounded-xl text-sm disabled:opacity-50 flex items-center gap-1"
                    >
                        <Truck size={14} />
                        {actionLoading ? "Đang xử lý..." : "Giao hàng"}
                    </motion.button>
                    </div>
                </motion.div>
                </motion.div>
            )}
            </AnimatePresence>

            {/* BILL MODAL */}
            <AnimatePresence>
            {orders.map((o) =>
                billModal ? (
                <motion.div
                    key={o.orderId}
                    className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
                >
                    <motion.div className="bg-white p-6 rounded-3xl w-[400px]">
                    <h3 className="mb-3 font-semibold">Kiểm tra thanh toán</h3>

                    <img src={billModal} className="w-full rounded-xl mb-3" />

                    <div className="flex justify-end gap-2">
                        <button onClick={() => setBillModal(null)}>Đóng</button>

                        <button
                        onClick={() => confirmPayment(o.orderId)}
                        className="bg-teal-600 text-white px-4 py-2 rounded-xl"
                        >
                        Xác nhận đã nhận tiền
                        </button>
                    </div>
                    </motion.div>
                </motion.div>
                ) : null
            )}
            </AnimatePresence>

        </div>
    );
}