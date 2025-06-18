
interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
  required?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
}
const TextInput: React.FC<Props> = ({ id, label, value, onChange, type='text', error, required, autoFocus, placeholder }) => (
  <div className="form-group">
    <label htmlFor={id}>{label}{required ? ' *' : ''}</label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      aria-invalid={!!error}
      autoFocus={autoFocus}
      placeholder={placeholder}
    />
    {error && <span className="error">{error}</span>}
  </div>
);
export default TextInput;


