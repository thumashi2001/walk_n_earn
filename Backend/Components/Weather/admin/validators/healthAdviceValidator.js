

const validateHealthAdviceRequest = (data) => {
  const errors = [];

  // --- Basic Info ---
  if (!data.title || data.title.trim() === "") {
    errors.push("Title is required.");
  }

  if (!data.advice || data.advice.trim() === "") {
    errors.push("Advice is required.");
  }

  // Category
  const allowedCategories = [
    "Temperature",
    "Rain / Storm",
    "Wind",
    "Humidity",
    "General Health",
  ];
  if (!data.category) {
    errors.push("Category is required.");
  } else if (!allowedCategories.includes(data.category)) {
    errors.push(`Category must be one of: ${allowedCategories.join(", ")}.`);
  }

  // Severity
  const allowedSeverities = ["Normal", "Low", "Caution", "Moderate"];
  if (!data.severity) {
    errors.push("Severity is required.");
  } else if (!allowedSeverities.includes(data.severity)) {
    errors.push(`Severity must be one of: ${allowedSeverities.join(", ")}.`);
  }

  // Priority
  if (data.priority == null) {
    errors.push("Priority is required.");
  } else if (typeof data.priority !== "number" || data.priority < 1 || data.priority > 3) {
    errors.push("Priority must be a number between 1 and 3.");
  }

  // --- Trigger ---
  const trigger = data.trigger;
  if (!trigger) {
    errors.push("Trigger object is required.");
  } else {
    const allowedParameters = ["Temperature", "WeatherCondition", "Humidity", "Wind"];
    if (!trigger.parameter) {
      errors.push("Trigger parameter is required.");
    } else if (!allowedParameters.includes(trigger.parameter)) {
      errors.push(`Trigger parameter must be one of: ${allowedParameters.join(", ")}.`);
    }

    const allowedConditionTypes = ["RANGE", "EXACT"];
    if (!trigger.conditionType) {
      errors.push("Trigger conditionType is required.");
    } else if (!allowedConditionTypes.includes(trigger.conditionType)) {
      errors.push(`Trigger conditionType must be one of: ${allowedConditionTypes.join(", ")}.`);
    }

    const exactValues = ["Clear", "Clouds", "Rain", "Drizzle", "Thunderstorm", "Snow", "Mist"];

    // WeatherCondition → must be EXACT + exactValue
    if (trigger.parameter === "WeatherCondition") {
      if (trigger.conditionType !== "EXACT") {
        errors.push("WeatherCondition must use EXACT conditionType.");
      }
      if (!trigger.exactValue) {
        errors.push("WeatherCondition requires exactValue.");
      } else if (!exactValues.includes(trigger.exactValue)) {
        errors.push(`exactValue must be one of: ${exactValues.join(", ")}.`);
      }
      if (trigger.range && (trigger.range.min != null || trigger.range.max != null)) {
        errors.push("WeatherCondition cannot have range values.");
      }
    }

    // Numeric triggers → must be RANGE + min/max
    if (["Temperature", "Humidity", "Wind"].includes(trigger.parameter)) {
      if (trigger.conditionType !== "RANGE") {
        errors.push(`${trigger.parameter} must use RANGE conditionType.`);
      }
      if (!trigger.range || (trigger.range.min == null && trigger.range.max == null)) {
        errors.push(`${trigger.parameter} requires at least min or max value.`);
      }
      if (trigger.exactValue) {
        errors.push(`${trigger.parameter} cannot have exactValue.`);
      }
    }
  }

  // --- Optional: Timing ---
  if (data.timeStart && !/^\d{2}:\d{2}$/.test(data.timeStart)) {
    errors.push("timeStart must be in HH:mm format.");
  }
  if (data.timeEnd && !/^\d{2}:\d{2}$/.test(data.timeEnd)) {
    errors.push("timeEnd must be in HH:mm format.");
  }
  if (data.validFrom && isNaN(Date.parse(data.validFrom))) {
    errors.push("validFrom must be a valid date.");
  }
  if (data.validTo && isNaN(Date.parse(data.validTo))) {
    errors.push("validTo must be a valid date.");
  }

  return errors;
};

module.exports = { validateHealthAdviceRequest };
