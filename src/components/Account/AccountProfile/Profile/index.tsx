"use client";

import React, { useState, useEffect } from "react";
import { retrieveCustomer } from "@lib/data/customer";
import { updateCustomer } from "@lib/data/customer";
import { Input, Button } from "@/components/UI";
import toast from "react-hot-toast";

const Profile = () => {
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const customerData = await retrieveCustomer();
        setCustomer(customerData);
        setFormData({
          first_name: customerData?.first_name || "",
          last_name: customerData?.last_name || "",
          email: customerData?.email || "",
          phone: customerData?.phone || "",
        });
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
      // Email'i çıkar çünkü Medusa customer update API'si email'i kabul etmiyor
      const { email, ...updateData } = formData;
      await updateCustomer(updateData);
      setIsEditing(false);
      // Refresh customer data
      const updatedCustomer = await retrieveCustomer();
      setCustomer(updatedCustomer);
      toast.success("Profil başarıyla güncellendi!");
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error(
        "Profil güncellenemedi. Lütfen tekrar deneyin. " +
          (error.message || error.toString())
      );
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark mb-2">Profil Bilgileri</h1>
        <p className="text-gray-600">
          Profil bilgilerinizi görüntüleyin ve güncelleyin.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Ad"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
          <Input
            label="Soyad"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>

        <Input
          label="E-posta"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={true}
          required
        />
        <p className="text-sm text-gray-500 -mt-4">
          E-posta adresi güvenlik nedeniyle değiştirilemez.
        </p>

        <Input
          label="Telefon"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          disabled={!isEditing}
        />

        <div className="flex gap-4">
          {!isEditing ? (
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              variant="primary"
            >
              Profili Düzenle
            </Button>
          ) : (
            <>
              <Button type="submit" variant="primary">
                Değişiklikleri Kaydet
              </Button>
              <Button
                type="button"
                onClick={() => setIsEditing(false)}
                variant="secondary"
              >
                İptal
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default Profile;
