import React from "react";

export const NumberFormatter = ({ phone, fontSize }) => {
  if (typeof phone !== "string" || !phone) return "Noma'lum raqam";

  // Faqat raqamlarni olish (masalan, +998901234567 dan faqat 998901234567)
  const digits = phone.replace(/\D/g, "");

  // O'zbekiston raqami uzunligini tekshirish (12 ta raqam: 998 + 9 ta raqam)
  if (digits.length !== 12 || !digits.startsWith("998")) {
    return "Noto'g'ri raqam";
  }
  return (
    <p className={`text-[${fontSize}]`}>
      +{digits.slice(0, 3)} {digits.slice(3, 5)} {digits.slice(5, 8)} {""}
      {digits.slice(8, 10)} {digits.slice(10, 12)}
    </p>
  );
};
