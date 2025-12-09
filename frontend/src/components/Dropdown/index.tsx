import { useState } from "react";

export default function ElegantDropdown({ label = "Network", options = [] }) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(options[0] || null);

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm shadow-md transition-all"
            >
                <span className="text-sm font-medium">{selected?.label || label}</span>
                <svg
                    className={`w-4 h-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {open && (
                <div className="absolute mt-2 w-48 rounded-2xl bg-white/10 backdrop-blur-sm shadow-xl border border-white/10 overflow-hidden z-50">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                setSelected(opt);
                                setOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/20 transition-all"
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// Usage example:
// <ElegantDropdown
//   label="Select Network"
//   options={[{ label: "Base", value: "base" }, { label: "BSC", value: "bsc" }]}
// />
