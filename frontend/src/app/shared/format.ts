const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

/** "2024-06-01" → "juin 2024" (sans conversion de fuseau). */
export function monthYear(iso: string | null | undefined): string {
  if (!iso) return '';
  const [y, m] = iso.split('-');
  const month = MONTHS[Number(m) - 1];
  return month ? `${month} ${y}` : y;
}

export function period(start: string, end: string | null): string {
  return `${monthYear(start)} — ${end ? monthYear(end) : "Aujourd’hui"}`;
}

export function initials(fullName: string | null | undefined): string {
  if (!fullName) return 'DY';
  return fullName.trim().split(/\s+/).slice(0, 3).map((w) => w[0]?.toUpperCase() ?? '').join('');
}

/** Date relative courte pour l'admin (« Il y a 2 h », « Hier »…). */
export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "À l’instant";
  if (min < 60) return `Il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `Il y a ${h} h`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'Hier';
  if (d < 30) return `Il y a ${d} j`;
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** N'autorise que http(s) dans les href dynamiques (défense en profondeur contre javascript:). */
export function safeUrl(url: string | null | undefined): string | null {
  return url && /^https?:\/\//i.test(url) ? url : null;
}

/** Image : URL http(s) ou nom d'un fichier du dossier public/ (ex. « eddy-photo.jpg »). */
export function imageSrc(value: string | null | undefined): string | null {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return /^[\w][\w./-]*\.(jpe?g|png|webp|gif|svg)$/i.test(value) ? value : null;
}

/** « DOFFOU EDDY YANN » → « Doffou Eddy Yann ». */
export function titleCase(text: string): string {
  return text.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (_, sep: string, c: string) => sep + c.toUpperCase());
}
