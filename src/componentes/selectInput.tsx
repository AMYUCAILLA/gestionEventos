import { useTranslation } from 'react-i18next'

interface Props {
  id: string
  label: string              // ← pasa la key o el texto ya traducido
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  required?: boolean
  error?: string
}
const SelectInput: React.FC<Props> = ({ id, label, value, onChange, options, required, error }) => {
  const { t } = useTranslation()

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}{required ? ' *' : ''}</label>

      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-invalid={!!error}
      >
        <option value="">{t('form.selectPlaceholder')}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {/* Si las etiquetas de opciones vienen sin traducir, tradúcelas aquí: */}
            {t(opt.label)}
          </option>
        ))}
      </select>

      {error && <span className="error">{error}</span>}
    </div>
  )
}
export default SelectInput
