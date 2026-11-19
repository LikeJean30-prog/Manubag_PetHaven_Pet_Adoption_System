// Turns a backend error into { message, errors } for the form (NFR-017)
export function readApiError(error) {
  if (!error.response) {
    return { message: 'Cannot reach the server. Check that the backend is running.', errors: {} }
  }
  const data = error.response.data ?? {}
  return {
    message: data.message ?? 'Something went wrong. Please try again.',
    errors: data.errors ?? {},
  }
}