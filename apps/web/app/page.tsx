"use client";

import { defaultCheckoutOptions, generateCheckoutUrl } from "@kontigo/common";
import { useCallback, useState } from "react";

export default function PaymentPage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = useCallback(async () => {
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
              onChange={(e) => setWalletAddress(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="0x..."
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Receipt Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium">
              Dollar Amount
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="0.00"
            />
          </div>

          <button
            type="button"
            onClick={handleContinue}
            className="w-full bg-[#FA7500] text-white py-2 px-4 rounded-md hover:bg-[#E06A00]"
            disabled={loading}
          >
            {loading ? "Loading..." : "Continue"}
          </button>
        </div>
      </div>
    </main>
  );
}
