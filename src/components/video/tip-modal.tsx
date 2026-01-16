"use client";

import { useState } from "react";
import { FiX, FiDollarSign, FiCheck } from "react-icons/fi";
import { SiEthereum } from "react-icons/si";
import toast from "react-hot-toast";

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorName: string;
  creatorDID: string;
  creatorWallet?: string;
  videoId?: string;
}

type PaymentMethod = "crypto" | "card";
type CryptoCurrency = "ETH" | "USDC";

export function TipModal({
  isOpen,
  onClose,
  creatorName,
  creatorDID,
  creatorWallet,
  videoId,
}: TipModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("crypto");
  const [cryptoCurrency, setCryptoCurrency] = useState<CryptoCurrency>("ETH");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);
  const [tipSent, setTipSent] = useState(false);

  const presetAmounts = paymentMethod === "crypto"
    ? ["0.001", "0.005", "0.01", "0.05"]
    : ["5", "10", "25", "50"];

  const handleTipSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setProcessing(true);

      if (paymentMethod === "crypto") {
        await handleCryptoTip();
      } else {
        await handleStripeTip();
      }

      setTipSent(true);
      toast.success(`Tip sent to ${creatorName}!`);

      // Reset and close after showing success
      setTimeout(() => {
        setTipSent(false);
        setAmount("");
        setMessage("");
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Tip error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send tip");
    } finally {
      setProcessing(false);
    }
  };

  const handleCryptoTip = async () => {
    // TODO: Implement Web3 wallet integration with Wagmi
    // For now, show placeholder message

    // Example future implementation:
    // import { useAccount, useSendTransaction } from 'wagmi';
    // const { sendTransaction } = useSendTransaction();
    //
    // if (!creatorWallet) {
    //   throw new Error("Creator has not set up their wallet");
    // }
    //
    // const amountInWei = parseEther(amount);
    // await sendTransaction({
    //   to: creatorWallet,
    //   value: amountInWei,
    // });

    // Save tip to backend
    await fetch("/api/tips/crypto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toDID: creatorDID,
        amount: parseFloat(amount),
        currency: cryptoCurrency,
        videoId,
        message,
        txHash: `mock-tx-${Date.now()}`, // Will be real txHash once Web3 is integrated
      }),
    });

    console.log(`Sending ${amount} ${cryptoCurrency} to ${creatorName}`);
  };

  const handleStripeTip = async () => {
    // TODO: Implement Stripe payment integration
    // For now, show placeholder message

    // Example future implementation:
    // const response = await fetch("/api/tips/stripe", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     toDID: creatorDID,
    //     amount: parseFloat(amount),
    //     videoId,
    //     message,
    //   }),
    // });
    // const { clientSecret } = await response.json();
    //
    // // Use Stripe Elements to complete payment
    // const { error } = await stripe.confirmPayment({
    //   clientSecret,
    //   confirmParams: { return_url: window.location.href },
    // });

    console.log(`Processing $${amount} Stripe payment to ${creatorName}`);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast("Stripe integration coming in Phase 7B!");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="relative w-full max-w-md bg-[#1a0b2e] border border-[#2f2942] rounded-[24px] p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full transition"
        >
          <FiX className="w-5 h-5" />
        </button>

        {tipSent ? (
          // Success State
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
              <FiCheck className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Tip Sent!</h2>
            <p className="text-gray-400">
              {creatorName} will receive your {amount} {paymentMethod === "crypto" ? cryptoCurrency : "USD"} tip
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Tip {creatorName}</h2>
              <p className="text-gray-400 text-sm">
                Show your support for their amazing content
              </p>
            </div>

            {/* Payment Method Toggle */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => setPaymentMethod("crypto")}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  paymentMethod === "crypto"
                    ? "border-[#EB83EA] bg-[#EB83EA]/10"
                    : "border-[#2f2942] hover:border-[#EB83EA]/50"
                }`}
              >
                <SiEthereum className={`w-6 h-6 ${paymentMethod === "crypto" ? "text-[#EB83EA]" : "text-gray-400"}`} />
                <span className="font-semibold text-sm">Crypto</span>
              </button>
              <button
                onClick={() => setPaymentMethod("card")}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  paymentMethod === "card"
                    ? "border-[#EB83EA] bg-[#EB83EA]/10"
                    : "border-[#2f2942] hover:border-[#EB83EA]/50"
                }`}
              >
                <FiDollarSign className={`w-6 h-6 ${paymentMethod === "card" ? "text-[#EB83EA]" : "text-gray-400"}`} />
                <span className="font-semibold text-sm">Card</span>
              </button>
            </div>

            {/* Crypto Currency Selection */}
            {paymentMethod === "crypto" && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Currency
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCryptoCurrency("ETH")}
                    className={`px-4 py-2 rounded-lg border transition ${
                      cryptoCurrency === "ETH"
                        ? "border-[#EB83EA] bg-[#EB83EA]/10 text-white"
                        : "border-[#2f2942] text-gray-400 hover:border-[#EB83EA]/50"
                    }`}
                  >
                    ETH
                  </button>
                  <button
                    onClick={() => setCryptoCurrency("USDC")}
                    className={`px-4 py-2 rounded-lg border transition ${
                      cryptoCurrency === "USDC"
                        ? "border-[#EB83EA] bg-[#EB83EA]/10 text-white"
                        : "border-[#2f2942] text-gray-400 hover:border-[#EB83EA]/50"
                    }`}
                  >
                    USDC
                  </button>
                </div>
              </div>
            )}

            {/* Amount Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Amount {paymentMethod === "crypto" ? `(${cryptoCurrency})` : "(USD)"}
              </label>
              <input
                type="number"
                step={paymentMethod === "crypto" ? "0.001" : "1"}
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={paymentMethod === "crypto" ? "0.001" : "5.00"}
                className="w-full px-4 py-3 bg-[#0f071a] border border-[#2f2942] rounded-xl focus:outline-none focus:border-[#EB83EA] transition text-lg"
              />
            </div>

            {/* Preset Amounts */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset)}
                  className="px-3 py-2 bg-[#0f071a] border border-[#2f2942] hover:border-[#EB83EA] rounded-lg text-sm font-semibold transition"
                >
                  {paymentMethod === "crypto" ? preset : `$${preset}`}
                </button>
              ))}
            </div>

            {/* Optional Message */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Leave a kind message..."
                maxLength={200}
                rows={3}
                className="w-full px-4 py-3 bg-[#0f071a] border border-[#2f2942] rounded-xl focus:outline-none focus:border-[#EB83EA] transition resize-none text-sm"
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {message.length}/200
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleTipSubmit}
              disabled={processing || !amount}
              className="w-full px-6 py-4 bg-[#EB83EA] hover:bg-[#E748E6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-full transition-colors flex items-center justify-center gap-2"
            >
              {processing ? (
                "Processing..."
              ) : (
                <>
                  <FiDollarSign className="w-5 h-5" />
                  Send Tip
                </>
              )}
            </button>

            {/* Info Text */}
            <p className="text-xs text-gray-500 text-center mt-4">
              {paymentMethod === "crypto"
                ? "Tips are sent directly to the creator's wallet on Base Network"
                : "Secure payment processing by Stripe"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
