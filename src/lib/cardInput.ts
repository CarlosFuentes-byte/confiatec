export function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

export function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function isCardComplete({
  number,
  name,
  expiry,
  cvc,
}: {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
}) {
  const digits = number.replace(/\s/g, "");
  const expiryValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry);
  return digits.length === 16 && name.trim().length > 1 && expiryValid && /^\d{3,4}$/.test(cvc);
}
