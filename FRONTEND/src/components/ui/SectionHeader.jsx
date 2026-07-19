function SectionHeader({ title, subtitle }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#111827]">
        {title}
      </h1>

      <p className="text-[#6B7280] mt-2">
        {subtitle}
      </p>
    </div>
  );
}

export default SectionHeader;