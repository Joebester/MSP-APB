export function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 text-sm">
      <span className="shrink-0 text-gray-500">{label}</span>
      <span className="text-right font-semibold text-gray-900">{value || '—'}</span>
    </div>
  );
}

export function InfoSection({ title, children }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-gray-900">{title}</h3>
      <div className="border-t border-gray-200 pt-2">{children}</div>
    </div>
  );
}
