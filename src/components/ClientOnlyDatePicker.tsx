import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface ClientOnlyDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  dateFormat?: string;
  placeholderText?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  hasError?: boolean;
}

export const ClientOnlyDatePicker: React.FC<ClientOnlyDatePickerProps> = ({
  selected,
  onChange,
  dateFormat = "yyyy-MM-dd",
  placeholderText,
  disabled = false,
  minDate,
  maxDate,
  hasError = false,
}) => {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      dateFormat={dateFormat}
      placeholderText={placeholderText}
      disabled={disabled}
      minDate={minDate}
      maxDate={maxDate}
    />
  );
}; 