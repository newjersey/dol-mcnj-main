import * as Sentry from "@sentry/node";
import * as dotenv from "dotenv";
import express from "express";
dotenv.config();

const { SENTRY_DSN } = process.env;

// or using CommonJS
// const Sentry = require('@sentry/node');
// const express = require('express');

const app = express();

export default (() => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Sentry.Integrations.Express({ app }),
      // Automatically instrument Node.js libraries and frameworks
      ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
  return Sentry;
})();
