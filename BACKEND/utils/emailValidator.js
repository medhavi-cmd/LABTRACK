const ALLOWED_DOMAINS = [
  "bmu.edu.in",
  "bml.edu.in",
];

export const isBMUEmail = (email) => {
  if (!email) return false;

  const normalizedEmail = email.trim().toLowerCase();

  const domain = normalizedEmail.split("@")[1];

  return ALLOWED_DOMAINS.includes(domain);
};