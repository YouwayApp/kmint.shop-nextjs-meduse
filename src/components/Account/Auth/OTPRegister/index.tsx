"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  authenticateWithPhone,
  registerWithPhone,
} from "../../../../lib/data/customer";
import { Input, Button } from "@/components/UI";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Props = {
  phone: string;
  customerData?: {
    first_name: string;
    last_name: string;
    phone: string;
  };
  setShowOtp: (showOtp: boolean) => void;
  formData?: {
    first_name: string;
    last_name: string;
    password: string;
    birthday: string;
    tc: string;
    phone: string;
  } | null;
  setFormData?: (
    formData: {
      first_name: string;
      last_name: string;
      password: string;
      birthday: string;
      tc: string;
      phone: string;
    } | null
  ) => void;
};

const ErrorMessage = ({ error }: { error?: string }) => {
  return <div className="text-red-500">{error}</div>;
};

export const Otp = ({
  phone,
  customerData,
  setShowOtp,
  formData,
  setFormData,
}: Props) => {
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const handleSubmit = useCallback(async () => {
    if (otp.length !== 6 || hasSubmitted || isLoading) {
      return;
    }

    setHasSubmitted(true);
    setIsLoading(true);
    setError("");

    try {
      const response = await registerWithPhone({
        phone,
        otp,
      });

      if (response.success) {
        toast.success("Telefon numarası başarıyla doğrulandı!");
        router.push("/account");
      } else {
        setError(response.error || "OTP doğrulaması başarısız");
        setHasSubmitted(false); // Allow retry on error
      }
    } catch (err) {
      setError("Doğrulama başarısız. Lütfen tekrar deneyin.");
      setHasSubmitted(false); // Allow retry on error
      console.error("OTP verification error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [otp, phone, router, hasSubmitted, isLoading]);

  const handleResend = async () => {
    try {
      setShowOtp(false);
    } catch (err) {
      setError("OTP tekrar gönderilemedi. Lütfen tekrar deneyin.");
    }
  };

  const handleBack = () => {
    setShowOtp(false);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const numericValue = pastedData.replace(/\D/g, "").slice(0, 6);

    if (numericValue) {
      setOtp(numericValue);
      // Focus the next empty input after pasted content
      const nextEmptyIndex = Math.min(numericValue.length, 5);
      inputRefs.current[nextEmptyIndex]?.focus();
    }
  };

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === 6 && !isLoading && !hasSubmitted) {
      handleSubmit();
    }
  }, [otp, isLoading, hasSubmitted, handleSubmit]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className=" flex flex-col items-center" data-testid="otp-page">
        <h1 className="text-large-semi uppercase mb-6">
          Telefon Numarasını Doğrula
        </h1>
        <p className="text-center text-base-regular text-ui-fg-base mb-4">
          Giriş yapmak için telefon numaranıza gönderilen kodu girin.
        </p>
        <div className="flex gap-2 mb-4">
          {[...Array(6)].map((_, index) => (
            <Input
              key={index}
              type="text"
              maxLength={1}
              pattern="\d*"
              inputMode="numeric"
              disabled={isLoading}
              className="w-10 h-12 text-center"
              onPaste={handlePaste}
              value={otp[index] || ""}
              onChange={(e) => {
                const elm = e.target;
                const value = elm.value;
                setOtp((prev) => {
                  const newOtp = prev.split("");
                  newOtp[index] = value;
                  return newOtp.join("");
                });
                setHasSubmitted(false); // Reset submission flag when OTP changes
                if (value && /^\d+$/.test(value)) {
                  // Move focus to next input
                  const nextInput =
                    elm.parentElement?.nextElementSibling?.querySelector(
                      "input"
                    );
                  nextInput?.focus();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !e.currentTarget.value) {
                  // Move focus to previous input on backspace
                  const prevInput =
                    e.currentTarget.parentElement?.previousElementSibling?.querySelector(
                      "input"
                    );
                  prevInput?.focus();
                }
              }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between gap-x-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="text-small-regular"
          >
            ← Forma Dön
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResend}
            disabled={countdown > 0}
            className="text-small-regular text-ui-fg-interactive disabled:text-ui-fg-disabled disabled:cursor-not-allowed"
          >
            {countdown > 0
              ? `${countdown}s sonra tekrar gönder`
              : "Kodu Tekrar Gönder"}
          </Button>
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleSubmit}
          disabled={otp.length !== 6}
          loading={isLoading}
        >
          {isLoading ? "Doğrulanıyor..." : "OTP Doğrula"}
        </Button>

        <ErrorMessage error={error} data-testid="register-error" />
      </div>
    </>
  );
};
