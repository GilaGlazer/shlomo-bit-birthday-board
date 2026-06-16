// Parse birthDate string as LOCAL date (not UTC) to avoid timezone shift
const parseLocalDate = (birthDate: string): Date => {
  const [y, m, d] = birthDate.substring(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const getAge = (birthDate: string): number => {
  const today = new Date();
  const birth = parseLocalDate(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

export const getDaysUntilBirthday = (birthDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const birth = parseLocalDate(birthDate);
  const next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (next.getTime() < today.getTime()) {
    next.setFullYear(today.getFullYear() + 1);
  }
  return Math.round((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export const formatBirthDate = (birthDate: string): string => {
  const date = parseLocalDate(birthDate);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export const toBirthDateInput = (birthDate: string): string =>
  birthDate.substring(0, 10);

export const AVATAR_COLORS = [
  'from-violet-500 to-purple-600',
  'from-pink-500 to-rose-600',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-red-500 to-pink-600',
  'from-indigo-500 to-blue-600',
  'from-fuchsia-500 to-violet-600',
];

export const getAvatarColor = (name: string): string =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
