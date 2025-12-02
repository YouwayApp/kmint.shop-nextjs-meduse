"use client";

import React, { useState, useEffect } from "react";
import LocalizedClientLink from "@/components/Meduse/localized-client-link";
import { listOrders } from "@lib/data/orders";
import { convertToLocale } from "@/lib/util/money";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await listOrders();
        setOrders(ordersData || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark mb-2">Sipariş Geçmişi</h1>
        <p className="text-gray-600">
          Sipariş geçmişinizi görüntüleyin ve siparişlerinizi takip edin.
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-dark">
                    Sipariş #{order.display_id}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-dark">
                    {convertToLocale({
                      amount: order.total,
                      currency_code: order.currency_code,
                    })}
                  </p>
                  <span
                    className={`inline-block px-3 py-1 text-sm rounded-full ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "canceled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">
                    {order.items?.length || 0} ürün
                  </p>
                </div>
                <LocalizedClientLink
                  href={`/account/orders/details/${order.id}`}
                  className="px-4 py-2 bg-blue-600 text-ui-fg-inverted rounded-md hover:bg-blue-700 transition-colors"
                >
                  Detayları Görüntüle
                </LocalizedClientLink>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mb-6">
            <svg
              className="w-16 h-16 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-dark mb-2">
            Henüz sipariş yok
          </h3>
          <p className="text-gray-600 mb-6">Henüz hiç sipariş vermediniz.</p>
          <LocalizedClientLink
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Alışverişe Başla
          </LocalizedClientLink>
        </div>
      )}
    </div>
  );
};

export default Orders;
