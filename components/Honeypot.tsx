/**
 * Spam trap. Hidden from people and screen readers; bots that auto-fill every
 * input fill this one, and the forms Worker then drops the submission.
 */
export default function Honeypot() {
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}
    >
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
