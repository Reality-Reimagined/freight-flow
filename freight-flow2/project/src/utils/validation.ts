export const validateLoadForm = (formData: any) => {
  const errors: Record<string, string> = {};

  if (!formData.origin) {
    errors.origin = 'Origin is required';
  }

  if (!formData.destination) {
    errors.destination = 'Destination is required';
  }

  if (!formData.pickupDate) {
    errors.pickupDate = 'Pickup date is required';
  }

  if (!formData.deliveryDate) {
    errors.deliveryDate = 'Delivery date is required';
  }

  if (!formData.rate || parseFloat(formData.rate) <= 0) {
    errors.rate = 'Valid rate is required';
  }

  if (!formData.weight || parseFloat(formData.weight) <= 0) {
    errors.weight = 'Valid weight is required';
  }

  if (!formData.contactName) {
    errors.contactName = 'Contact name is required';
  }

  if (!formData.contactPhone) {
    errors.contactPhone = 'Contact phone is required';
  }

  if (!formData.contactEmail) {
    errors.contactEmail = 'Contact email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
    errors.contactEmail = 'Invalid email format';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};