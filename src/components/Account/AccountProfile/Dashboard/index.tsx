"use client";

import React, { useState, useEffect } from "react";
import { retrieveCustomer } from "@lib/data/customer";
import { listOrders } from "@lib/data/orders";
import {
  ShoppingBag,
  DollarSign,
  Calendar,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  Wallet2,
} from "lucide-react";
import { convertToLocale } from "@/lib/util/money";

const Dashboard = () => {
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customerData, ordersData] = await Promise.all([
          retrieveCustomer(),
          listOrders(),
        ]);
        setCustomer(customerData);
        setOrders(ordersData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} className="text-green-600" />;
      case "pending":
        return <Clock size={16} className="text-yellow-600" />;
      default:
        return <XCircle size={16} className="text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      completed: "Tamamlandı",
      pending: "Beklemede",
      canceled: "İptal Edildi",
      processing: "İşleniyor",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#b8860a] to-[#7a5700] rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Tekrar hoş geldin, {customer?.first_name}!
        </h1>
        <p className="text-white/90">Hesap aktivitelerinizin bir özeti.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Toplam Sipariş
                </p>
                <p className="text-3xl font-bold text-dark">{orders.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Wallet2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Toplam Harcama
                </p>
                <p className="text-3xl font-bold text-dark">
                  {orders.length > 0
                    ? convertToLocale({
                        amount: orders.reduce(
                          (total, order) => total + (order.total || 0),
                          0
                        ),
                        currency_code: orders[0]?.currency_code || "TRY",
                      })
                    : "₺0,00"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-dark flex items-center gap-2">
            <Package className="w-6 h-6 text-[#b8860a]" />
            Son Siparişler
          </h2>
        </div>
        {orders.length > 0 ? (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-5 hover:border-[#b8860a] hover:shadow-md transition-all bg-gray-50 hover:bg-white"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold text-dark text-lg">
                        Sipariş #{order.display_id}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {new Date(order.created_at).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span
                        className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "canceled"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xl font-bold text-dark mb-2">
                      {convertToLocale({
                        amount: order.total,
                        currency_code: order.currency_code,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              Henüz sipariş bulunmamaktadır
            </p>
            <p className="text-gray-500 text-sm mt-2">
              İlk siparişinizi vermek için alışverişe başlayın!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
