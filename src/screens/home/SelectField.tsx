type SelectFieldProps = {
  label: string;
  value: string | null;
  placeholder: string;
  disabled?: boolean;
  onClick: () => void;
};

export function SelectField({
  label,
  value,
  placeholder,
  disabled = false,
  onClick,
}: SelectFieldProps) {
  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-gray-500 mb-2">{label}</p>
      <button
        className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 text-left transition-colors ${
          disabled
            ? 'border-gray-100 bg-gray-50 cursor-not-allowed'
            : value
            ? 'border-[#3182F6] bg-white'
            : 'border-gray-200 bg-white hover:border-[#3182F6]'
        }`}
        onClick={onClick}
        disabled={disabled}
      >
        <span className={`text-base font-medium ${value ? 'text-gray-900' : 'text-gray-400'}`}>
          {value ?? placeholder}
        </span>
        <span className="text-gray-400 text-lg">›</span>
      </button>
    </div>
  );
}
