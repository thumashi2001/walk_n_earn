const mongoose = require("mongoose");

const HealthAdviceSchema = new mongoose.Schema(
  {
    // Basic Info

    title: {
      type: String,
      required: true,
      trim: true,
      // Example: "High Heat Hydration Reminder"
    },

    advice: {
      type: String,
      required: true,
      trim: true,
      // Example: "Drink water frequently and avoid walking under direct sunlight."
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Temperature",
        "Rain / Storm",
        "Wind",
        "Humidity",
        "General Health",
      ],
      // Example: "Temperature"
    },

    severity: {
      type: String,
      required: true,
      enum: ["Normal", "Low", "Caution", "Moderate"],
    },

    priority: {
      type: Number,
      required: true,
      min: 1,
      max: 3,
    },

    active: {
      type: Boolean,
      default: true,
    },

    // Trigger Configuration

    trigger: {
      parameter: {
        type: String,
        required: true,
        enum: ["Temperature", "WeatherCondition", "Humidity", "Wind"],
        // Example: "Temperature"
      },

      conditionType: {
        type: String,
        required: true,
        enum: ["RANGE", "EXACT"],
      },

      range: {
        min: Number,
        max: Number,
        // Example for Temperature: min: 30, max: null → "temperature > 30°C"
        // Example for Humidity: min: 80, max: null → "humidity > 80%"
      },

      exactValue: {
        type: String,
        enum: [
          "Clear",
          "Clouds",
          "Rain",
          "Drizzle",
          "Thunderstorm",
          "Snow",
          "Mist",
        ],
      },
    },

    // Validity / Timing

    validFrom: Date,
    validTo: Date,
    timeStart: String,
    timeEnd: String,
    // Examples:
    // validFrom: "2026-02-25T00:00:00Z"
    // validTo: "2026-02-28T23:59:59Z"
    // timeStart: "12:00"
    // timeEnd: "15:00"
  },
  { timestamps: true },
);

// Validation Logic

HealthAdviceSchema.pre("validate", function (next) {
  const trigger = this.trigger;

  if (!trigger) return next(new Error("Trigger is required."));

  // WeatherCondition must use EXACT logic
  if (trigger.parameter === "WeatherCondition") {
    if (trigger.conditionType !== "EXACT")
      return next(new Error("WeatherCondition must use EXACT condition type."));
    if (!trigger.exactValue)
      return next(new Error("WeatherCondition requires an exactValue."));
    if (trigger.range && (trigger.range.min || trigger.range.max))
      return next(new Error("WeatherCondition cannot use range values."));
  }

  // Numeric parameters (Temperature, Humidity, Wind) must use RANGE
  if (["Temperature", "Humidity", "Wind"].includes(trigger.parameter)) {
    if (trigger.conditionType !== "RANGE")
      return next(
        new Error(`${trigger.parameter} must use RANGE condition type.`),
      );
    if (
      !trigger.range ||
      (trigger.range.min == null && trigger.range.max == null)
    )
      return next(new Error(`${trigger.parameter} requires min or max value.`));
    if (trigger.exactValue)
      return next(new Error(`${trigger.parameter} cannot use exactValue.`));
  }
});

module.exports = mongoose.model("Weather_HealthAdvice", HealthAdviceSchema);
