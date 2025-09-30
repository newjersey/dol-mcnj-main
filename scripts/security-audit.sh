#!/usr/bin/env bash

# Security audit script for My Career NJ
# This script runs comprehensive security checks on both frontend and backend dependencies

set -e

echo "🔒 Running comprehensive security audit for My Career NJ"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Check if jq is installed for JSON parsing
if ! command -v jq &> /dev/null; then
    print_warning "jq is not installed. JSON parsing will be limited."
    JQ_AVAILABLE=false
else
    JQ_AVAILABLE=true
fi

print_status "Starting security audit..."

# Create reports directory
mkdir -p reports
REPORT_DATE=$(date +"%Y-%m-%d_%H-%M-%S")
REPORT_FILE="reports/security-audit-$REPORT_DATE.txt"

# Initialize report
echo "Security Audit Report - Generated on $(date)" > "$REPORT_FILE"
echo "======================================================" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Frontend Security Audit
print_status "Running frontend security audit..."
echo "Frontend Security Audit:" >> "$REPORT_FILE"
echo "------------------------" >> "$REPORT_FILE"

if npm audit --audit-level moderate --json > frontend-audit.json 2>/dev/null; then
    print_success "Frontend audit completed successfully"
    echo "✅ No moderate or higher vulnerabilities found in frontend" >> "$REPORT_FILE"
else
    print_warning "Frontend vulnerabilities found"
    npm audit --audit-level moderate 2>&1 | tee -a "$REPORT_FILE"
fi

echo "" >> "$REPORT_FILE"

# Backend Security Audit
print_status "Running backend security audit..."
echo "Backend Security Audit:" >> "$REPORT_FILE"
echo "----------------------" >> "$REPORT_FILE"

if npm --prefix=backend audit --audit-level moderate --json > backend-audit.json 2>/dev/null; then
    print_success "Backend audit completed successfully"
    echo "✅ No moderate or higher vulnerabilities found in backend" >> "$REPORT_FILE"
else
    print_warning "Backend vulnerabilities found"
    npm --prefix=backend audit --audit-level moderate 2>&1 | tee -a "$REPORT_FILE"
fi

echo "" >> "$REPORT_FILE"

# Check for outdated packages
print_status "Checking for outdated packages..."
echo "Outdated Packages:" >> "$REPORT_FILE"
echo "-----------------" >> "$REPORT_FILE"

echo "Frontend outdated packages:" >> "$REPORT_FILE"
npm outdated 2>&1 | tee -a "$REPORT_FILE" || echo "No outdated frontend packages found" >> "$REPORT_FILE"

echo "" >> "$REPORT_FILE"
echo "Backend outdated packages:" >> "$REPORT_FILE"
npm --prefix=backend outdated 2>&1 | tee -a "$REPORT_FILE" || echo "No outdated backend packages found" >> "$REPORT_FILE"

echo "" >> "$REPORT_FILE"

# License check
print_status "Checking package licenses..."
echo "Package Licenses:" >> "$REPORT_FILE"
echo "----------------" >> "$REPORT_FILE"

echo "Frontend top-level dependencies:" >> "$REPORT_FILE"
npm ls --depth=0 2>&1 | head -20 | tee -a "$REPORT_FILE"

echo "" >> "$REPORT_FILE"
echo "Backend top-level dependencies:" >> "$REPORT_FILE"
npm --prefix=backend ls --depth=0 2>&1 | head -20 | tee -a "$REPORT_FILE"

# Final check for high/critical vulnerabilities
print_status "Final check for high/critical vulnerabilities..."
echo "" >> "$REPORT_FILE"
echo "High/Critical Vulnerability Check:" >> "$REPORT_FILE"
echo "--------------------------------" >> "$REPORT_FILE"

CRITICAL_FOUND=false

if ! npm audit --audit-level high >/dev/null 2>&1; then
    print_error "High or critical vulnerabilities found in frontend!"
    echo "❌ HIGH/CRITICAL vulnerabilities found in frontend" >> "$REPORT_FILE"
    npm audit --audit-level high 2>&1 | tee -a "$REPORT_FILE"
    CRITICAL_FOUND=true
else
    print_success "No high/critical vulnerabilities in frontend"
    echo "✅ No high/critical vulnerabilities in frontend" >> "$REPORT_FILE"
fi

if ! npm --prefix=backend audit --audit-level high >/dev/null 2>&1; then
    print_error "High or critical vulnerabilities found in backend!"
    echo "❌ HIGH/CRITICAL vulnerabilities found in backend" >> "$REPORT_FILE"
    npm --prefix=backend audit --audit-level high 2>&1 | tee -a "$REPORT_FILE"
    CRITICAL_FOUND=true
else
    print_success "No high/critical vulnerabilities in backend"
    echo "✅ No high/critical vulnerabilities in backend" >> "$REPORT_FILE"
fi

# Summary
echo "" >> "$REPORT_FILE"
echo "Summary:" >> "$REPORT_FILE"
echo "--------" >> "$REPORT_FILE"

if [ "$CRITICAL_FOUND" = true ]; then
    print_error "Security audit completed with CRITICAL issues found!"
    echo "❌ CRITICAL VULNERABILITIES FOUND - IMMEDIATE ACTION REQUIRED" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "Recommended actions:" >> "$REPORT_FILE"
    echo "1. Run 'npm audit fix' in affected directories" >> "$REPORT_FILE"
    echo "2. Update vulnerable packages manually if auto-fix doesn't work" >> "$REPORT_FILE"
    echo "3. Consider using alternative packages if vulnerabilities cannot be fixed" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "Report saved to: $REPORT_FILE"
    exit 1
else
    print_success "Security audit completed successfully!"
    echo "✅ Security audit completed - no critical vulnerabilities found" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "Report saved to: $REPORT_FILE"
fi

# Cleanup temporary files
rm -f frontend-audit.json backend-audit.json

print_status "Security audit report saved to: $REPORT_FILE"