function Card({ title, children }) {
  return (
    <div className="min-w-0 w-full max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-slate-950">{title}</h3>
      {children}
    </div>
  );
}

export default Card;