"use client";

import { defaultCheckoutOptions, generateCheckoutUrl } from "@kontigo/common";
import { useCallback, useState } from "react";

// Simple validation functions
const isValidEVMAddress = (address: string) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidAmount = (amount: string) => {
  const numAmount = Number.parseFloat(amount);
  return !Number.isNaN(numAmount) && numAmount > 0;
};

// Simple validation on input
const validateField = (field: "wallet" | "email" | "amount", value: string) => {
  switch (field) {
    case "wallet":
      return !value
        ? "Wallet address is required"
        : !isValidEVMAddress(value)
        ? "Invalid EVM wallet address"
        : "";
    case "email":
      return !value
        ? "Email is required"
        : !isValidEmail(value)
        ? "Invalid email address"
        : "";
    case "amount":
      return !value
        ? "Amount is required"
        : !isValidAmount(value)
        ? "Amount must be greater than zero"
        : "";
    default:
      return "";
  }
};

export default function PaymentPage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    wallet: "",
    email: "",
    amount: "",
  });

  const handleContinue = useCallback(async () => {
    // Validate all fields
    const newErrors = {
      wallet: validateField("wallet", walletAddress),
      email: validateField("email", email),
      amount: validateField("amount", amount),
    };

    setErrors(newErrors);

    // If any errors, don't proceed
    if (newErrors.wallet || newErrors.email || newErrors.amount) {
      return;
    }

    setLoading(true);

    try {
      const uri = await generateCheckoutUrl("/api/orders", {
        ...defaultCheckoutOptions,
        payment: {
          ...defaultCheckoutOptions.payment,
          receiptEmail: email,
        },
        recipient: {
          walletAddress,
        },
        lineItems: {
          ...defaultCheckoutOptions.lineItems,
          executionParameters: {
            ...defaultCheckoutOptions.lineItems.executionParameters,
            amount,
          },
        },
      });

      window.location.href = uri;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [amount, email, walletAddress]);

  // Simple check if form is valid
  const isFormValid =
    !errors.wallet &&
    !errors.email &&
    !errors.amount &&
    walletAddress &&
    email &&
    amount;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Payment Details</h1>

        <div className="space-y-4">
          <div>
            <label htmlFor="wallet" className="block text-sm font-medium">
              Recipient Wallet Address
            </label>
            <input
              id="wallet"
              type="text"
              value={walletAddress}
              onChange={(e) => {
                setWalletAddress(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  wallet: validateField("wallet", e.target.value),
                }));
              }}
              className={`mt-1 block w-full rounded-md border ${
                errors.wallet ? "border-red-500" : "border-gray-300"
              } px-3 py-2`}
              placeholder="0x..."
            />
            {errors.wallet && (
              <p className="mt-1 text-sm text-red-500">{errors.wallet}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Receipt Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  email: validateField("email", e.target.value),
                }));
              }}
              className={`mt-1 block w-full rounded-md border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } px-3 py-2`}
              placeholder="email@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium">
              Dollar Amount
            </label>
            <input
              id="amount"
              type="number"
              min={1}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  amount: validateField("amount", e.target.value),
                }));
              }}
              className={`mt-1 block w-full rounded-md border ${
                errors.amount ? "border-red-500" : "border-gray-300"
              } px-3 py-2`}
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleContinue}
            className={`w-full py-2 px-4 rounded-md ${
              loading || !isFormValid
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#FA7500] hover:bg-[#E06A00]"
            } text-white`}
            disabled={loading || !isFormValid}
          >
            {loading ? "Loading..." : "Continue"}
          </button>
        </div>
      </div>
    </main>
  );
}
