export const formatCurrency = (n: number) => {
  return "₹" + n.toLocaleString("en-IN");
};

export const AVATAR_COLORS = ["#0891b2", "#0d9488", "#7c3aed", "#d97706"];

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h} hrs ago`;
  return "Yesterday";
}
