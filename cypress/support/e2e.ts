// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
import "cypress-axe";

// Handle uncaught exceptions from React hydration errors
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test on uncaught exceptions
  // Specifically handle React error #418 (hydration mismatch)
  if (err.message.includes('Minified React error #418')) {
    return false;
  }
  // returning true will fail the test
  return true;
});

// Alternatively you can use CommonJS syntax:
// require('./commands')
