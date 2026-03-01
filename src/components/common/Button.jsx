import "./Button.css";

/**
 * Button
 * @param {"primary"|"ghost"} variant
 * @param {boolean} loading
 * @param {boolean} disabled
 * @param {string} className
 * @param {function} onClick
 * @param {React.ReactNode} children
 */
export default function Button({
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  onClick,
  children,
  ...rest
}) {
  return (
    <button
      className={`btn btn--${variant} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? (
        <>
          <span className="btn__spinner" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
}