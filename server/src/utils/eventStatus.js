export function getEventStatus(event) {
  const now = new Date();
  const startsAt = new Date(event.date);
  const deadline = new Date(event.registrationDeadline);

  if (now >= startsAt) {
    return "completed";
  }
  if (now > deadline) {
    return "registration-closed";
  }
  const hoursUntilStart = (startsAt - now) / (1000 * 60 * 60);
  if (hoursUntilStart <= 48) {
    return "upcoming";
  }
  return "registration-open";
}

export function getEventStatusLabel(event) {
  const status = getEventStatus(event);
  const labels = {
    completed: "Completed",
    "registration-closed": "Registration Closed",
    "registration-open": "Registration Open",
    upcoming: "Happening Soon",
  };
  return labels[status] || status;
}

export function getEventStatusColor(event) {
  const status = getEventStatus(event);
  const colors = {
    completed: "slate",
    "registration-closed": "amber",
    "registration-open": "emerald",
    upcoming: "blue",
  };
  return colors[status] || "slate";
}

export function isRegistrationOpen(event) {
  const status = getEventStatus(event);
  return status === "registration-open" || status === "upcoming";
}
