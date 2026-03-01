import "./InputField.css";

/**
 * InputField
 * @param {string} label
 * @param {string} name
 * @param {"text"|"password"|"email"} type
 * @param {string} placeholder
 * @param {string} value
 * @param {function} onChange
 * @param {React.ReactNode} icon  — SVG element
 * @param {boolean} hasError
 */
export default function InputField({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  icon,
  hasError = false,
  autoComplete,
}) {
  return (
    <div className="input-field">
      {label && <label className="input-field__label" htmlFor={name}>{label}</label>}
      <div className="input-field__wrap">
        {icon && <span className="input-field__icon">{icon}</span>}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={`input-field__input ${hasError ? "input-field__input--error" : ""}`}
        />
      </div>
    </div>
  );
}