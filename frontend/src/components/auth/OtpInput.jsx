import React, { useRef } from 'react';

const OtpInput = ({ value = [], onChange, error }) => {
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    // Allow only numbers
    if (val && !/^\d+$/.test(val)) return;

    const newValue = [...value];
    // Keep only the last character entered
    newValue[index] = val.slice(-1);
    onChange(newValue);

    // Auto-focus next input if a digit is entered
    if (val && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Focus previous input if current is already empty and backspace is pressed
        const newValue = [...value];
        newValue[index - 1] = '';
        onChange(newValue);
        inputsRef.current[index - 1]?.focus();
      } else {
        const newValue = [...value];
        newValue[index] = '';
        onChange(newValue);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    // Validate if paste data is exactly 6 digits
    if (!/^\d{6}$/.test(pasteData)) return;

    const digits = pasteData.split('');
    onChange(digits);
    inputsRef.current[5]?.focus();
  };

  return (
    <div className="flex justify-between gap-2.5 max-w-sm mx-auto" onPaste={handlePaste}>
      {[...Array(6)].map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={`w-12 h-12 text-center text-lg font-bold bg-neutral-50 border-2 rounded-xl focus:bg-white focus:outline-none transition-all duration-200
            ${error 
              ? 'border-red-200 focus:border-red-500 focus:ring-1 focus:ring-red-500/25 bg-red-50/30' 
              : 'border-neutral-100 focus:border-brand-purple-500 focus:ring-1 focus:ring-brand-purple-500/25'
            }
          `}
        />
      ))}
    </div>
  );
};

export default OtpInput;
