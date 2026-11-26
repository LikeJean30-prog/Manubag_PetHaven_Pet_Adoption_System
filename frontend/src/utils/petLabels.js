export const SPECIES = [
  { value: 'DOG', label: 'Dog' },
  { value: 'CAT', label: 'Cat' },
  { value: 'OTHER', label: 'Other' },
]

export const SEX = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
]

export const SIZE = [
  { value: 'SMALL', label: 'Small' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LARGE', label: 'Large' },
]

export const VACCINATION = [
  { value: 'VACCINATED', label: 'Vaccinated' },
  { value: 'PARTIALLY_VACCINATED', label: 'Partially vaccinated' },
  { value: 'NOT_VACCINATED', label: 'Not vaccinated' },
  { value: 'UNKNOWN', label: 'Unknown' },
]

export const PET_STATUS = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'ADOPTED', label: 'Adopted' },
  { value: 'ARCHIVED', label: 'Archived' },
]

export function labelOf(options, value) {
  return options.find((o) => o.value === value)?.label ?? value
}

export function formatAge(months) {
  if (months === null || months === undefined || months === '') return ''
  const years = Math.floor(months / 12)
  const rest = months % 12
  const parts = []
  if (years > 0) parts.push(`${years} yr${years > 1 ? 's' : ''}`)
  if (rest > 0 || years === 0) parts.push(`${rest} mo${rest !== 1 ? 's' : ''}`)
  return parts.join(' ')
}