const trustItems = [
  { icon: "🔒", text: "Datos 100% seguros" },
  { icon: "📊", text: "Basado en estadísticas reales" },
  { icon: "⚠️", text: "Solo análisis informativo" },
  { icon: "🔞", text: "+18 · Juega con responsabilidad" },
  { icon: "❌", text: "Sin garantía de resultados" },
];

export default function TrustBar() {
  return (
    <div className="bg-dark-800 border-y border-white/5 py-3 px-4">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
        {trustItems.map((item) => (
          <div key={item.text} className="flex items-center gap-2 text-xs text-slate-500">
            <span>{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
