
// Validate request body for create/update HealthAdvice
const validateHealthAdviceRequest = (data) => {
  const errors = [];

  // Basic Info
  if (!data.title || data.title.trim() === "") {
    errors.push("Title is required.");
  }

  if (!data.advice || data.advice.trim() === "") {
    errors.push("Advice is required.");
  }

  if (!data.category) {
    errors.push("Category is required.");
  } else if (
    !["Temperature", "Rain / Storm", "Wind", "Humidity", "General Health"].includes(
      data.category
    )
  ) {
    errors.push("Invalid category.");
  }

  if (!data.severity) {
    errors.push("Severity is required.");
  } else if (!["Normal", "Low", "Caution", "Moderate"].includes(data.severity)) {
    errors.push("Invalid severity.");
  }

  if (data.priority == null) {
    errors.push("Priority is required.");
  } else if (data.priority < 1 || data.priority > 3) {
    errors.push("Priority must be between 1 and 3.");
  }

  // Trigger Validation
  const trigger = data.trigger;
  if (!trigger) {
    errors.push("Trigger object is required.");
  } else {
    if (!trigger.parameter) {
      errors.push("Trigger parameter is required.");
    }

    if (trigger.parameter === "WeatherCondition") {
      if (trigger.conditionType !== "EXACT") {
        errors.push("WeatherCondition must use EXACT condition type.");
      }
      if (!trigger.exactValue) {
        errors.push("WeatherCondition requires an exactValue.");
      }
      if (trigger.range && (trigger.range.min != null || trigger.range.max != null)) {
        errors.push("WeatherCondition cannot use range values.");
      }
    }

    if (["Temperature", "Humidity", "Wind"].includes(trigger.parameter)) {
      if (trigger.conditionType !== "RANGE") {
        errors.push(`${trigger.parameter} must use RANGE condition type.`);
      }
      if (!trigger.range || (trigger.range.min == null && trigger.range.max == null)) {
        errors.push(`${trigger.parameter} requires min or max value.`);
      }
      if (trigger.exactValue) {
        errors.push(`${trigger.parameter} cannot use exactValue.`);
      }
    }
  }

  return errors;
};

module.exports = { validateHealthAdviceRequest };
