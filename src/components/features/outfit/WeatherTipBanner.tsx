export function WeatherTipBanner({ tip }: { tip: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-off-white px-3.5 py-3 text-sm text-charcoal">
      <span aria-hidden>☀️</span>
      <p className="leading-5">{tip}</p>
    </div>
  );
}
