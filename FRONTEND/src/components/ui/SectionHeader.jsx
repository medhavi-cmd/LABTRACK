function SectionHeader({ title, subtitle }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white">
        {title}
      </h1>

      <p className="text-slate-400 mt-2">
        {subtitle}
      </p>
    </div>
  );
}

export default SectionHeader;