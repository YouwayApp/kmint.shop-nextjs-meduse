"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import LocalizedClientLink from "@/components/Meduse/localized-client-link";
import React from "react";
import { updatePassword } from "@lib/data/customer";
import { useActionState } from "react";

const ResetPassword = () => {
  const [message, formAction, isPending] = useActionState(updatePassword, null);

  return (
    <>
      <Breadcrumb title={"Şifre Sıfırla"} pages={["Şifre Sıfırla"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px]  w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Şifrenizi Sıfırlayın
              </h2>
              <p>Aşağıda yeni şifrenizi girin.</p>
            </div>

            <div>
              <form action={formAction}>
                {message && (
                  <div
                    className={`mb-4 p-3 rounded-md ${
                      (message as any).success
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <p
                      className={`text-sm ${
                        (message as any).success
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {(message as any).success
                        ? (message as any).message
                        : (message as any).error}
                    </p>
                  </div>
                )}

                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5">
                    Yeni Şifre <span className="text-red">*</span>
                  </label>

                  <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    placeholder="Yeni şifrenizi girin"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="confirmPassword" className="block mb-2.5">
                    Yeni Şifreyi Onayla <span className="text-red">*</span>
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    required
                    placeholder="Yeni şifrenizi onaylayın"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <input
                  type="hidden"
                  name="token"
                  value={
                    typeof window !== "undefined"
                      ? new URLSearchParams(window.location.search).get(
                          "token"
                        ) || ""
                      : ""
                  }
                />

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Şifre Sıfırlanıyor...
                    </div>
                  ) : (
                    "Şifre Sıfırla"
                  )}
                </button>

                <p className="text-center mt-6">
                  Şifrenizi hatırlıyor musunuz?
                  <LocalizedClientLink
                    href="/auth/login"
                    className="text-dark ease-out duration-200 hover:text-blue pl-2"
                  >
                    Giriş Yap
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

export default ResetPassword;
