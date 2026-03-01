import "./Alert.css";

/**
 * Alert
 * @param {"error"|"success"|"info"} type
 * @param {string} message
 */
export default function Alert({ type = "error", message }) {
  if (!message) return null;
  return (
    <div className={`alert alert--${type}`} role="alert">
      {message}
    </div>
  );
}