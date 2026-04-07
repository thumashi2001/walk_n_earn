import { authInputClassName, authLabelClassName } from "./authFieldStyles";

export default function LabeledIconInput({
  id,
  label,
  labelRight,
  type = "text",
  name,
  value,
  onChange,
  autoComplete,
  placeholder,
  icon,
  required,
}) {
  return (
    <div className="group/field">
      <div
        className={`mb-1.5 flex items-center gap-2 ${labelRight ? "justify-between" : ""}`}
      >
        <label htmlFor={id} className={authLabelClassName}>
          {label}
        </label>
        {labelRight}
      </div>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 transition-colors duration-300 group-focus-within/field:text-[#FF7518]">
          {icon}
        </span>
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          value={value}
          onChange={onChange}
          className={authInputClassName}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
