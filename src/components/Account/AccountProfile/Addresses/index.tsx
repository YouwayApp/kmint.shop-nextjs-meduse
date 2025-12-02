"use client";

import React, { useState, useEffect } from "react";
import { retrieveCustomer } from "@lib/data/customer";
import {
  addCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
} from "@lib/data/customer";
import { Input, Button, Select } from "@/components/UI";
import toast from "react-hot-toast";

const Addresses = () => {
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    company: "",
    address_1: "",
    address_2: "",
    city: "",
    postal_code: "",
    province: "",
    country_code: "US",
    phone: "",
    is_default_billing: false,
    is_default_shipping: false,
  });

  const countryOptions = [
    { value: "US", label: "United States" },
    { value: "CA", label: "Canada" },
    { value: "GB", label: "United Kingdom" },
    { value: "DE", label: "Germany" },
    { value: "FR", label: "France" },
  ];

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const customerData = await retrieveCustomer();
        setCustomer(customerData);
      } catch (error) {
        console.error("Error fetching customer:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomer();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        // For update, we need to use the server action format
        const formDataObj = new FormData();
        Object.keys(formData).forEach((key) => {
          formDataObj.append(key, formData[key]);
        });
        formDataObj.append("addressId", editingAddress.id);
        await updateCustomerAddress(
          { addressId: editingAddress.id },
          formDataObj
        );
      } else {
        // For add, we need to use the server action format
        const formDataObj = new FormData();
        Object.keys(formData).forEach((key) => {
          formDataObj.append(key, formData[key]);
        });
        await addCustomerAddress({}, formDataObj);
      }

      // Refresh customer data
      const updatedCustomer = await retrieveCustomer();
      setCustomer(updatedCustomer);

      // Reset form
      setShowAddForm(false);
      setEditingAddress(null);
      setFormData({
        first_name: "",
        last_name: "",
        company: "",
        address_1: "",
        address_2: "",
        city: "",
        postal_code: "",
        province: "",
        country_code: "US",
        phone: "",
        is_default_billing: false,
        is_default_shipping: false,
      });
      toast.success("Adres başarıyla kaydedildi!");
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Adres kaydedilemedi. Lütfen tekrar deneyin.");
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      first_name: address.first_name,
      last_name: address.last_name,
      company: address.company || "",
      address_1: address.address_1,
      address_2: address.address_2 || "",
      city: address.city,
      postal_code: address.postal_code,
      province: address.province || "",
      country_code: address.country_code,
      phone: address.phone || "",
      is_default_billing: address.is_default_billing,
      is_default_shipping: address.is_default_shipping,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (addressId) => {
    if (confirm("Bu adresi silmek istediğinizden emin misiniz?")) {
      try {
        await deleteCustomerAddress(addressId);
        // Refresh customer data
        const updatedCustomer = await retrieveCustomer();
        setCustomer(updatedCustomer);
        toast.success("Adres başarıyla silindi!");
      } catch (error) {
        console.error("Error deleting address:", error);
        toast.error("Adres silinemedi. Lütfen tekrar deneyin.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-dark mb-2">
            Teslimat Adresleri
          </h1>
          <p className="text-gray-600">
            Teslimat adreslerinizi görüntüleyin ve güncelleyin.
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} variant="primary">
          Adres Ekle
        </Button>
      </div>

      {/* Address List */}
      <div className="space-y-4">
        {customer?.addresses?.map((address) => (
          <div
            key={address.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium text-dark">
                    {address.first_name} {address.last_name}
                  </h3>
                  {address.is_default_shipping && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Varsayılan Teslimat
                    </span>
                  )}
                  {address.is_default_billing && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Varsayılan Fatura
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm">
                  {address.address_1}
                  {address.address_2 && `, ${address.address_2}`}
                </p>
                <p className="text-gray-600 text-sm">
                  {address.city}, {address.province} {address.postal_code}
                </p>
                <p className="text-gray-600 text-sm">{address.country_code}</p>
                {address.phone && (
                  <p className="text-gray-600 text-sm">
                    Telefon: {address.phone}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(address)}
                  variant="outline"
                  size="sm"
                >
                  Düzenle
                </Button>
                <Button
                  onClick={() => handleDelete(address.id)}
                  variant="danger"
                  size="sm"
                >
                  Sil
                </Button>
              </div>
            </div>
          </div>
        ))}

        {(!customer?.addresses || customer.addresses.length === 0) && (
          <div className="text-center py-8">
            <p className="text-gray-600">Adres bulunamadı</p>
          </div>
        )}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="mt-8 border-t pt-8">
          <h2 className="text-xl font-bold text-dark mb-4">
            {editingAddress ? "Adresi Düzenle" : "Yeni Adres Ekle"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Ad"
                name="first_name"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    first_name: e.target.value,
                  })
                }
                required
              />
              <Input
                label="Soyad"
                name="last_name"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    last_name: e.target.value,
                  })
                }
                required
              />
            </div>

            <Input
              label="Şirket"
              name="company"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
            />

            <Input
              label="Adres Satırı 1"
              name="address_1"
              value={formData.address_1}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address_1: e.target.value,
                })
              }
              required
            />

            <Input
              label="Adres Satırı 2"
              name="address_2"
              value={formData.address_2}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address_2: e.target.value,
                })
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Şehir"
                name="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                required
              />
              <Input
                label="İl/Eyalet"
                name="province"
                value={formData.province}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    province: e.target.value,
                  })
                }
              />
              <Input
                label="Posta Kodu"
                name="postal_code"
                value={formData.postal_code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    postal_code: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Ülke"
                name="country_code"
                value={formData.country_code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    country_code: e.target.value,
                  })
                }
                options={countryOptions}
                required
              />
              <Input
                label="Telefon"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_default_shipping"
                  checked={formData.is_default_shipping}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_default_shipping: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                Varsayılan Teslimat Adresi
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_default_billing"
                  checked={formData.is_default_billing}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_default_billing: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                Varsayılan Fatura Adresi
              </label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" variant="primary">
                {editingAddress ? "Adresi Güncelle" : "Adres Ekle"}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingAddress(null);
                  setFormData({
                    first_name: "",
                    last_name: "",
                    company: "",
                    address_1: "",
                    address_2: "",
                    city: "",
                    postal_code: "",
                    province: "",
                    country_code: "US",
                    phone: "",
                    is_default_billing: false,
                    is_default_shipping: false,
                  });
                }}
                variant="secondary"
              >
                İptal
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Addresses;
