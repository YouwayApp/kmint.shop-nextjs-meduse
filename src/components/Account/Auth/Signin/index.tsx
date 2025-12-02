"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import LocalizedClientLink from "@/components/Meduse/localized-client-link";
import React, { useState } from "react";
import { authenticateWithPhone } from "@lib/data/customer";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { PatternFormat } from "react-number-format";
import { Input } from "@/components/UI";
import { OtpLogin } from "../OTPLogin";

const Signin = () => {
  const [phone, setPhone] = useState<string>("");
  const [rawPhone, setRawPhone] = useState<string>("");
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const phoneToUse = rawPhone || phone.replace(/\s/g, "");

      if (!phoneToUse) {
        setError("Telefon numarası gereklidir");
        return;
      }

      const result = await authenticateWithPhone(`+90${phoneToUse}`);

      if (result === true) {
        setShowOtp(true);
        toast.success("OTP telefon numaranıza gönderildi!");
      } else {
        setError(result || "OTP gönderilemedi");
      }
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (showOtp) {
    return (
      <>
        <Breadcrumb
          title={"Telefonu Doğrula"}
          pages={["Giriş", "Telefonu Doğrula"]}
        />
        <section className="overflow-hidden py-20 bg-gray-2">
          <div className="max-w-[1170px]  w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
              <OtpLogin phone={phone} setShowOtp={setShowOtp} />
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Breadcrumb title={"Giriş"} pages={["Giriş"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px]  w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Hesabınıza Giriş Yapın
              </h2>
              <p>OTP almak için telefon numaranızı girin</p>
            </div>

            <div>
              <form onSubmit={handleSubmit}>
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
                      setPhone(values.value.replace(/\s/g, ""));
                      setRawPhone(values.value.replace(/\s/g, ""));
                    }}
                    required
                    className="w-full"
                  />
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      OTP Gönderiliyor...
                    </div>
                  ) : (
                    "OTP Gönder"
                  )}
                </button>

                <p className="text-center mt-6">
                  Hesabınız yok mu?
                  <LocalizedClientLink
                    href="/auth/register"
                    className="text-dark ease-out duration-200 hover:text-blue pl-2"
                  >
                    Şimdi Kayıt Ol!
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

export default Signin;
