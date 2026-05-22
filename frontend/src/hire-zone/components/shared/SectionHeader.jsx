const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-6">
    <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
    {subtitle && <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>}
  </div>
);

export default SectionHeader;
