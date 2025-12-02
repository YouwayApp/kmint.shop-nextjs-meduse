"use client";

import React, { useState, useEffect } from "react";
import LocalizedClientLink from "@/components/Meduse/localized-client-link";
import { retrieveOrder } from "@lib/data/orders";
import { convertToLocale } from "@/lib/util/money";
import { isIbanTransfer, isStripe, paymentInfoMap } from "@lib/constants";
import { Text } from "@medusajs/ui";
import {
  Package,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft,
  ShoppingBag,
  MapPin,
  CreditCard,
  Truck,
  Phone,
  Mail,
} from "lucide-react";

const OrderDetails = ({ params }) => {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await retrieveOrder(params.id);
        setOrder(orderData);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Sipariş bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark mb-4">
            Sipariş Bulunamadı
          </h2>
          <p className="text-gray-600 mb-6">Aradığınız sipariş mevcut değil.</p>
          <LocalizedClientLink
            href="/account/orders"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Siparişlere Dön
          </LocalizedClientLink>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return convertToLocale({
      amount,
      currency_code: order.currency_code || "try",
    });
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      completed: "Tamamlandı",
      pending: "Beklemede",
      canceled: "İptal Edildi",
      archived: "Arşivlendi",
    };
    return statusMap[status] || status;
  };

  const StatusIcon =
    order.status === "completed"
      ? CheckCircle
      : order.status === "canceled"
      ? XCircle
      : Clock;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#b8860a] to-[#b8860a] rounded-lg flex items-center justify-center shadow-md">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Sipariş #{order.display_id || order.id?.slice(0, 8)}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <p className="text-sm">
                  {new Date(order.created_at).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusIcon
              className={`w-5 h-5 ${
                order.status === "completed"
                  ? "text-green-600"
                  : order.status === "canceled"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            />
            <span
              className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full shadow-sm ${
                order.status === "completed"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : order.status === "pending"
                  ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                  : order.status === "canceled"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-gray-50 text-gray-700 border border-gray-200"
              }`}
            >
              {getStatusText(order.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Package className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Sipariş Öğeleri</h2>
          <span className="ml-auto text-sm text-gray-500">
            {order.items?.length || 0} ürün
          </span>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {order.items?.map((item: any, index: number) => {
              const productHandle =
                item.variant?.product?.handle || item.product_id;
              const productLink = productHandle
                ? `/products/${productHandle}`
                : "#";

              return (
                <div
                  key={item.id || index}
                  className="p-6 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <LocalizedClientLink href={productLink}>
                        <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.title || "Ürün resmi"}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder-image.png";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </LocalizedClientLink>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                        <LocalizedClientLink
                          href={productLink}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {item.title || item.product_title || "Ürün"}
                        </LocalizedClientLink>
                      </h3>
                      <div className="flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <span className="font-semibold text-gray-700">
                            Miktar:
                          </span>
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <span className="font-semibold text-gray-700">
                            Birim Fiyat:
                          </span>
                          <span className="font-medium">
                            {formatCurrency(item.unit_price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="flex-shrink-0 text-right sm:text-left sm:min-w-[120px]">
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(
                          (item.unit_price || 0) * (item.quantity || 1)
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order Summary and Details */}
      <div className="flex flex-col gap-6 mb-8">
        {/* Order Summary */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#b8860a] rounded-lg flex items-center justify-center shadow-md">
              <ShoppingBag className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Sipariş Özeti</h2>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Ara Toplam:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(order.subtotal || 0)}
                </span>
              </div>
              {order.shipping_total > 0 && (
                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Kargo:
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(order.shipping_total)}
                  </span>
                </div>
              )}
              {order.tax_total > 0 && (
                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                  <span className="text-gray-600">Vergi:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(order.tax_total)}
                  </span>
                </div>
              )}
              {order.discount_total > 0 && (
                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                  <span className="text-green-600 font-medium">İndirim:</span>
                  <span className="font-semibold text-green-600">
                    -{formatCurrency(order.discount_total)}
                  </span>
                </div>
              )}
              <div className="border-t-2 border-gray-200 pt-4 mt-2 bg-gradient-to-r from-blue-50 to-transparent -mx-6 px-6 py-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    Toplam:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(order.total || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shipping_address && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#b8860a] rounded-lg flex items-center justify-center shadow-md">
                <MapPin className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Teslimat Adresi
              </h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">
                    {order.shipping_address.first_name}{" "}
                    {order.shipping_address.last_name}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-gray-600 pl-13">
                <p className="flex items-start gap-2">
                  <span className="text-gray-400">📍</span>
                  <span>
                    {order.shipping_address.address_1}
                    {order.shipping_address.address_2 &&
                      `, ${order.shipping_address.address_2}`}
                  </span>
                </p>
                <p>
                  {order.shipping_address.city}
                  {order.shipping_address.province &&
                    `, ${order.shipping_address.province}`}
                  {order.shipping_address.postal_code &&
                    ` ${order.shipping_address.postal_code}`}
                </p>
                <p className="font-medium">
                  {order.shipping_address.country_code?.toUpperCase()}
                </p>
                {order.shipping_address.phone && (
                  <p className="pt-2 border-t border-gray-100">
                    <span className="font-semibold text-gray-700">
                      Telefon:
                    </span>{" "}
                    <span className="text-blue-600">
                      {order.shipping_address.phone}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Shipping and Payment Details */}
      <div className="flex flex-col gap-6 mb-8">
        {/* Kargo Bilgileri */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#b8860a] rounded-lg flex items-center justify-center shadow-md">
              <Truck className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Kargo Bilgileri
            </h2>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Kargo Adresi */}
              <div>
                <Text className="txt-medium-plus text-ui-fg-base mb-3 font-semibold text-gray-900">
                  Kargo Adresi
                </Text>
                <div className="space-y-1 text-gray-600">
                  <p className="font-medium text-gray-900">
                    {order.shipping_address?.first_name}{" "}
                    {order.shipping_address?.last_name}
                  </p>
                  <p>{order.shipping_address?.address_1}</p>
                  {order.shipping_address?.address_2 && (
                    <p>{order.shipping_address.address_2}</p>
                  )}
                  <p>
                    {order.shipping_address?.postal_code},{" "}
                    {order.shipping_address?.city}
                  </p>
                  <p className="font-medium">
                    {order.shipping_address?.country_code?.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* İletişim */}
              <div>
                <Text className="txt-medium-plus text-ui-fg-base mb-3 font-semibold text-gray-900">
                  İletişim
                </Text>
                <div className="space-y-2 text-gray-600">
                  {order.shipping_address?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{order.shipping_address.phone}</span>
                    </div>
                  )}
                  {order.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{order.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Kargo Yöntemi */}
              <div>
                <Text className="txt-medium-plus text-ui-fg-base mb-3 font-semibold text-gray-900">
                  Kargo Yöntemi
                </Text>
                <div className="text-gray-600">
                  {(order as any).shipping_methods?.[0]?.name ? (
                    <div>
                      <p className="font-medium text-gray-900">
                        {(order as any).shipping_methods[0].name}
                      </p>
                      <p className="text-sm mt-1">
                        {formatCurrency(
                          order.shipping_methods?.[0]?.total ?? 0
                        )}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500">Belirtilmemiş</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ödeme Bilgileri */}
        {(() => {
          const payment =
            order.payment_collections?.[0]?.payments?.[0] ||
            (order as any).payments?.[0] ||
            (order as any).payment;

          if (!payment) {
            return (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#b8860a] rounded-lg flex items-center justify-center shadow-md">
                    <CreditCard
                      className="w-6 h-6 text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Ödeme Bilgileri
                  </h2>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                  <p className="text-gray-600">Ödeme bilgileri yükleniyor...</p>
                </div>
              </div>
            );
          }

          const isIban = isIbanTransfer(payment.provider_id);
          const paymentData =
            (payment.data as any) || (payment as any).session_data || {};

          return (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#b8860a] rounded-lg flex items-center justify-center shadow-md">
                  <CreditCard
                    className="w-6 h-6 text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Ödeme Bilgileri
                </h2>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <div className="flex flex-col gap-6">
                  {/* Ödeme Yöntemi */}
                  <div>
                    <Text className="txt-medium-plus text-ui-fg-base mb-2 font-semibold text-gray-900">
                      Ödeme Yöntemi
                    </Text>
                    <Text
                      className="txt-medium text-ui-fg-subtle text-gray-700"
                      data-testid="payment-method"
                    >
                      {paymentInfoMap[payment.provider_id]?.title ||
                        payment.provider_id}
                    </Text>
                  </div>

                  {/* Ödeme Detayları */}
                  <div>
                    <Text className="txt-medium-plus text-ui-fg-base mb-3 font-semibold text-gray-900">
                      Ödeme Detayları
                    </Text>
                    {isIban ? (
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex flex-col gap-3">
                          {paymentData?.bankName && (
                            <div>
                              <Text className="txt-small text-ui-fg-subtle mb-1 text-gray-600">
                                Banka:
                              </Text>
                              <Text className="txt-medium text-ui-fg-base text-gray-900">
                                {paymentData.bankName}
                                {paymentData.branchName &&
                                  ` - ${paymentData.branchName}`}
                              </Text>
                            </div>
                          )}
                          {paymentData?.iban && (
                            <div>
                              <Text className="txt-small text-ui-fg-subtle mb-1 text-gray-600">
                                IBAN:
                              </Text>
                              <Text className="txt-medium text-ui-fg-base font-mono text-gray-900">
                                {paymentData.iban}
                              </Text>
                            </div>
                          )}
                          {paymentData?.accountHolderName && (
                            <div>
                              <Text className="txt-small text-ui-fg-subtle mb-1 text-gray-600">
                                Hesap Sahibi:
                              </Text>
                              <Text className="txt-medium text-ui-fg-base text-gray-900">
                                {paymentData.accountHolderName}
                              </Text>
                            </div>
                          )}
                          {!paymentData?.iban && !paymentData?.bankName && (
                            <div>
                              <Text className="txt-medium text-ui-fg-subtle text-gray-600">
                                IBAN ile havale ödeme yöntemi seçildi. Ödeme
                                bilgileri yakında eklenecek.
                              </Text>
                            </div>
                          )}
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <Text className="txt-small text-ui-fg-subtle mb-1 text-gray-600">
                              Ödenecek Tutar:
                            </Text>
                            <Text className="txt-medium-plus text-ui-fg-base font-semibold text-blue-600">
                              {formatCurrency(payment.amount)}
                            </Text>
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <Text className="txt-small text-ui-fg-muted text-gray-500">
                              Lütfen ödeme yaparken açıklama kısmına sipariş
                              numaranızı yazmayı unutmayın.
                            </Text>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 txt-medium text-ui-fg-subtle items-center">
                        <div className="flex items-center h-7 w-fit p-2 bg-gray-100 rounded">
                          {paymentInfoMap[payment.provider_id]?.icon}
                        </div>
                        <Text
                          data-testid="payment-amount"
                          className="text-gray-700"
                        >
                          {isStripe(payment.provider_id) &&
                          paymentData?.card_last4
                            ? `**** **** **** ${paymentData.card_last4}`
                            : `${formatCurrency(payment.amount)} ${new Date(
                                payment.created_at ?? ""
                              ).toLocaleString("tr-TR")} tarihinde ödendi`}
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Back to Orders */}
      <div className="flex justify-start pt-4">
        <LocalizedClientLink
          href="/account/orders"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-5 h-5" />
          Siparişlere Dön
        </LocalizedClientLink>
      </div>
    </div>
  );
};

export default OrderDetails;
