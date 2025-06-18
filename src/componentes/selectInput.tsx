

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
}
const SelectInput: React.FC<Props> = ({ id, label, value, onChange, options, required, error }) => (
  <div className="form-group">
    <label htmlFor={id}>{label}{required ? ' *' : ''}</label>
    <select
      id={id}
      value={value}
      onChange={e => onChange(e.target.value)}
      aria-invalid={!!error}
    >
      <option value="">-- Seleccionar --</option>
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
    {error && <span className="error">{error}</span>}
  </div>
);
export default SelectInput;


