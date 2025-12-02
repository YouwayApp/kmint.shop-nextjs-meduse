"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import LocalizedClientLink from "@/components/Meduse/localized-client-link";
import React, { useState } from "react";
import { registerWithPhone } from "@lib/data/customer";
import toast from "react-hot-toast";
import { PatternFormat } from "react-number-format";
import { Input } from "@/components/UI";
import { Otp } from "../OTPRegister";

const Signup = () => {
  const [phone, setPhone] = useState<string>("");
  const [rawPhone, setRawPhone] = useState<string>("");
  const [formValues, setFormValues] = useState({
    first_name: "",
    last_name: "",
    password: "",
    birthday: "",
    tc: "",
  });
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const [userPhone, setUserPhone] = useState<string>("");

  const [customerData, setCustomerData] = useState<{
    first_name: string;
    last_name: string;
    password: string;
    birthday: string;
    tc: string;
    phone: string;
  } | null>(null);

  const [formData, setFormData] = useState<{
    first_name: string;
    last_name: string;
    password: string;
    birthday: string;
    tc: string;
    phone: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const customerForm = {
        first_name: formData.get("first_name") as string,
        last_name: formData.get("last_name") as string,
        password: formData.get("password") as string,
        birthday: formData.get("birthday") as string,
        tc: formData.get("tc") as string,
        phone: `+90${rawPhone.replace(/\s/g, "")}`,
      };

      // Store form data before API call
      setFormData(customerForm);

      const response = await registerWithPhone(customerForm);

      if (response.success) {
        if (response.requiresOtp && response.phone) {
          setUserPhone(response.phone);
          setCustomerData(response.customerData || null);
          setShowOtp(true);
        } else {
          toast.success(response.message || "Başarılı");
        }
      } else {
        toast.error(response.error || "Kayıt başarısız");
      }
    } catch (error) {
      toast.error("Kayıt sırasında bir hata oluştu");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (showOtp) {
    return (
      <>
        <Breadcrumb
          title={"Telefonu Doğrula"}
          pages={["Kayıt", "Telefonu Doğrula"]}
        />
        <section className="overflow-hidden py-20 bg-gray-2">
          <div className="max-w-[1170px]  w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
              <Otp
                phone={userPhone}
                customerData={customerData}
                setShowOtp={setShowOtp}
                formData={formData}
                setFormData={setFormData}
              />
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Breadcrumb title={"Kayıt"} pages={["Kayıt"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px]  w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Hesap Oluştur
              </h2>
              <p>Aşağıdaki bilgilerinizi girin</p>
            </div>

            <div className="mt-5.5">
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="first_name" className="block mb-2.5">
                    Ad <span className="text-red">*</span>
                  </label>

                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    required
                    value={formValues.first_name}
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        first_name: e.target.value,
                      }))
                    }
                    placeholder="Adınızı girin"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="last_name" className="block mb-2.5">
                    Soyad <span className="text-red">*</span>
                  </label>

                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    required
                    value={formValues.last_name}
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        last_name: e.target.value,
                      }))
                    }
                    placeholder="Soyadınızı girin"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5">
                    Şifre <span className="text-red">*</span>
                  </label>

                  <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    value={formValues.password}
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="Şifrenizi girin"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="birthday" className="block mb-2.5">
                    Doğum Tarihi <span className="text-red">*</span>
                  </label>

                  <input
                    type="date"
                    name="birthday"
                    id="birthday"
                    required
                    value={formValues.birthday}
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        birthday: e.target.value,
                      }))
                    }
                    className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="tc" className="block mb-2.5">
                    TC Kimlik No <span className="text-red">*</span>
                  </label>

                  <input
                    type="text"
                    name="tc"
                    id="tc"
                    required
                    value={formValues.tc}
                    onChange={(e) =>
                      setFormValues((prev) => ({ ...prev, tc: e.target.value }))
                    }
                    placeholder="TC kimlik numaranızı girin (11 haneli)"
                    maxLength={11}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="phone" className="block mb-2.5">
                    Telefon Numarası <span className="text-red">*</span>
                  </label>

                  <PatternFormat
                    format="+90 (###) ### ## ##"
                    mask="_"
                    customInput={Input}
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+90 (5XX) XXX XX XX"
                    value={phone}
                    autoComplete="off"
                    onValueChange={(values) => {
                      setPhone(values.formattedValue);
                      setRawPhone(values.value);
                    }}
                    required
                    className="w-full"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Hesap Oluşturuluyor...
                    </div>
                  ) : (
                    "Hesap Oluştur"
                  )}
                </button>

                <p className="text-center mt-6">
                  Zaten hesabınız var mı?
                  <LocalizedClientLink
                    href="/auth/login"
                    className="text-dark ease-out duration-200 hover:text-blue pl-2"
                  >
                    Şimdi Giriş Yap
                  </LocalizedClientLink>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
