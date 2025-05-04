import { Check, Copy } from "lucide-react";
import React, { useState } from "react";

export const NumberFormatter = ({ phone, fontSize }) => {
  const [copied, setCopied] = useState(false);
  if (typeof phone !== "string" || !phone) return "Noma'lum raqam";

  // Faqat raqamlarni olish (masalan, +998901234567 dan faqat 998901234567)
  const digits = phone.replace(/\D/g, "");

  // O'zbekiston raqami uzunligini tekshirish (12 ta raqam: 998 + 9 ta raqam)
  if (digits.length !== 12 || !digits.startsWith("998")) {
    return "Noto'g'ri raqam";
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`+${phone}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <p className={`text-[${fontSize}]`}>
        +{digits.slice(0, 3)} {digits.slice(3, 5)} {digits.slice(5, 8)} {""}
        {digits.slice(8, 10)} {digits.slice(10, 12)}
      </p>
      <button
        onClick={copyToClipboard}
        className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Copy phone number"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-gray-500" />
        )}
      </button>
    </div>
  );
};
