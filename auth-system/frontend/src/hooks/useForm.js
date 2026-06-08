import { useState, useCallback, useRef } from 'react';

/**
 * Generic form hook with validation support.
 * Uses a ref for the validate function to avoid stale-closure issues.
 * @param {Object} initialValues - Initial field values
 * @param {Function} validate - Returns an errors object { field: 'message' }
 */
const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Keep validate in a ref so callbacks never go stale
  const validateRef = useRef(validate);
  validateRef.current = validate;

  // Keep values in a ref so blur handler reads latest without re-creating
  const valuesRef = useRef(values);
  valuesRef.current = values;

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear only the error for this field as the user types
    setErrors((prev) => (prev[name] ? { ...prev, [name]: '' } : prev));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (validateRef.current) {
      const validationErrors = validateRef.current(valuesRef.current);
      setErrors((prev) => ({ ...prev, [name]: validationErrors[name] || '' }));
    }
  }, []);

  const validateAll = useCallback(() => {
    if (!validateRef.current) return true;
    const validationErrors = validateRef.current(valuesRef.current);
    setErrors(validationErrors);
    setTouched(
      Object.keys(valuesRef.current).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );
    return Object.keys(validationErrors).length === 0;
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return { values, errors, touched, handleChange, handleBlur, validateAll, reset, setErrors };
};

export default useForm;
