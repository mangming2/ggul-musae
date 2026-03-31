type Option<T> = {
  label: string;
  value: T;
};

type BottomSheetProps<T> = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: Option<T>[];
  onSelect: (value: T) => void;
};

export function BottomSheet<T>({ isOpen, onClose, title, options, onSelect }: BottomSheetProps<T>) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="px-6 pt-5 pb-10">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
          <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
          <ul className="space-y-1">
            {options.map((option, idx) => (
              <li key={idx}>
                <button
                  className="w-full text-left px-4 py-4 rounded-2xl text-gray-800 font-medium text-base hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  onClick={() => {
                    onSelect(option.value);
                    onClose();
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
