export default function FormField({ id, label, error, hint, ...inputProps }) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        className={error ? 'input-error' : ''}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...inputProps}
      />
      {hint && !error && <small id={`${id}-hint`}>{hint}</small>}
      {error && <span id={`${id}-error`} className="field-error">{error}</span>}
    </div>
  )
}