export function validateEvent(data) {
  const errors = [];

  if (!data.name?.trim()) errors.push("Event name is required");
  if (!data.category?.trim()) errors.push("Category is required");
  if (!data.description?.trim()) errors.push("Description is required");
  if (!data.date) errors.push("Date is required");
  if (!data.time?.trim()) errors.push("Time is required");
  if (!data.venue?.trim()) errors.push("Venue is required");
  if (!data.registrationDeadline) errors.push("Registration deadline is required");
  if (data.capacity !== undefined && data.capacity !== null) {
    const cap = Number(data.capacity);
    if (isNaN(cap) || cap < 1) errors.push("Capacity must be a positive number");
  }

  if (data.time && !/^\d{2}:\d{2}$/.test(data.time)) {
    errors.push("Time must be in HH:MM format");
  }

  return errors;
}

export function validateRegistration(data) {
  const errors = [];

  if (!data.name?.trim()) errors.push("Full name is required");
  if (!data.email?.trim()) errors.push("Email is required");
  if (!data.college?.trim()) errors.push("College is required");
  if (!data.year?.trim()) errors.push("Year is required");
  if (!data.phone?.trim()) errors.push("Phone number is required");

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Please provide a valid email address");
  }

  if (data.phone) {
    const digits = data.phone.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15) {
      errors.push("Phone number must contain 7-15 digits");
    }
  }

  return errors;
}

export function validateLogin(data) {
  const errors = [];
  if (!data.email?.trim()) errors.push("Email is required");
  if (!data.password?.trim()) errors.push("Password is required");
  return errors;
}
