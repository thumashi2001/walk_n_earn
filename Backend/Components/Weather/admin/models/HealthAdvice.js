const mongoose = require("mongoose");

const HealthAdviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    advice: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Temperature",
        "Rain / Storm",
        "Wind",
        "Humidity",
        "UV Exposure",
        "General Health",
      ],
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

    trigger: {
      parameter: {
        type: String,
        required: true,
        enum: ["Temperature", "WeatherCondition", "Humidity", "Wind", "UV"],
      },

      conditionType: {
        type: String,
        required: true,
        enum: ["RANGE", "EXACT"],
      },

      range: {
        min: Number,
        max: Number,
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

    validFrom: Date,
    validTo: Date,
    timeStart: String,
    timeEnd: String,
  },
  { timestamps: true },
);

/* =========================
        field validation
========================= */

HealthAdviceSchema.pre("validate", function (next) {
  const trigger = this.trigger;

  if (!trigger) {
    return next(new Error("Trigger is required."));
  }

  // If WeatherCondition → must be EXACT
  if (trigger.parameter === "WeatherCondition") {
    if (trigger.conditionType !== "EXACT") {
      return next(new Error("WeatherCondition must use EXACT condition type."));
    }

    if (!trigger.exactValue) {
      return next(new Error("WeatherCondition requires an exactValue."));
    }

    if (trigger.range && (trigger.range.min || trigger.range.max)) {
      return next(new Error("WeatherCondition cannot use range values."));
    }
  }

  // If numeric parameter → must be RANGE
  if (["Temperature", "Humidity", "Wind", "UV"].includes(trigger.parameter)) {
    if (trigger.conditionType !== "RANGE") {
      return next(
        new Error(`${trigger.parameter} must use RANGE condition type.`),
      );
    }

    if (
      !trigger.range ||
      (trigger.range.min == null && trigger.range.max == null)
    ) {
      return next(new Error(`${trigger.parameter} requires min or max value.`));
    }

    if (trigger.exactValue) {
      return next(new Error(`${trigger.parameter} cannot use exactValue.`));
    }
  }

  next();
});

module.exports = mongoose.model("HealthAdvice", HealthAdviceSchema);
