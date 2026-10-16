export function scrollToSection(id: string): void {
  window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 20);
}
