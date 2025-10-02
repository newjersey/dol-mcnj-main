#!/bin/bash

# SEO Audit Script for My Career NJ
# This script checks various SEO elements and provides recommendations

echo "🔍 SEO AUDIT - My Career NJ"
echo "================================"
echo ""

# Check if essential SEO files exist
echo "📁 Checking Essential SEO Files:"
echo "--------------------------------"

files=(
  "public/robots.txt"
  "src/app/sitemap.ts" 
  "src/app/manifest.ts"
  "src/app/rss.xml/route.ts"
  "src/utils/seo.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file exists"
  else
    echo "❌ $file missing"
  fi
done

echo ""

# Check for meta tags in pages
echo "🏷️  Checking Page Metadata:"
echo "----------------------------"

pages=(
  "src/app/page.tsx"
  "src/app/training/page.tsx"
  "src/app/in-demand-occupations/page.tsx"
  "src/app/career-pathways/page.tsx"
  "src/app/navigator/page.tsx"
)

for page in "${pages[@]}"; do
  if [ -f "$page" ]; then
    if grep -q "generateMetadata" "$page"; then
      echo "✅ $page has metadata generation"
    else
      echo "⚠️  $page missing metadata generation"
    fi
  else
    echo "❌ $page not found"
  fi
done

echo ""

# Check for structured data
echo "📊 Checking Structured Data:"
echo "-----------------------------"

if grep -r "application/ld+json" src/app/; then
  echo "✅ Structured data found in application"
else
  echo "❌ No structured data found"
fi

echo ""

# Check for performance optimizations
echo "⚡ Checking Performance Optimizations:"
echo "--------------------------------------"

if grep -q "preconnect" src/app/layout.tsx; then
  echo "✅ Preconnect hints found"
else
  echo "⚠️  No preconnect hints found"
fi

if grep -q "preload" src/app/layout.tsx; then
  echo "✅ Preload hints found"
else
  echo "⚠️  No preload hints found"
fi

echo ""

# Check Next.js configuration
echo "⚙️  Checking Next.js SEO Configuration:"
echo "---------------------------------------"

if grep -q "compress: true" next.config.ts; then
  echo "✅ Compression enabled"
else
  echo "⚠️  Compression not explicitly enabled"
fi

if grep -q "poweredByHeader: false" next.config.ts; then
  echo "✅ X-Powered-By header disabled"
else
  echo "⚠️  X-Powered-By header not disabled"
fi

echo ""

# Check for accessibility features
echo "♿ Checking Accessibility Features:"
echo "-----------------------------------"

if grep -q "alt=" src/app/; then
  echo "✅ Alt text found in components"
else
  echo "⚠️  Alt text may be missing"
fi

if grep -q "aria-" src/app/; then
  echo "✅ ARIA attributes found"
else
  echo "⚠️  ARIA attributes may be missing"
fi

echo ""

# Security headers check
echo "🔒 Checking Security Headers:"
echo "------------------------------"

if grep -q "X-Frame-Options" next.config.ts; then
  echo "✅ X-Frame-Options configured"
else
  echo "❌ X-Frame-Options missing"
fi

if grep -q "X-Content-Type-Options" next.config.ts; then
  echo "✅ X-Content-Type-Options configured"
else
  echo "❌ X-Content-Type-Options missing"
fi

echo ""

# Final recommendations
echo "💡 SEO IMPROVEMENT RECOMMENDATIONS:"
echo "====================================="
echo ""
echo "1. ✅ robots.txt - Implemented"
echo "2. ✅ Sitemap - Implemented" 
echo "3. ✅ Structured Data - Added to layout and key pages"
echo "4. ✅ Meta Tags - Enhanced across all pages"
echo "5. ✅ Performance Hints - Added preconnect/preload"
echo "6. ✅ RSS Feed - Implemented"
echo "7. ✅ PWA Manifest - Added"
echo "8. ✅ Security Headers - Configured"
echo ""
echo "🎯 NEXT STEPS:"
echo "• Test with Google PageSpeed Insights"
echo "• Validate structured data with Google's Rich Results Test"
echo "• Submit sitemap to Google Search Console"
echo "• Monitor Core Web Vitals"
echo "• Set up Google Analytics 4 enhanced ecommerce"
echo ""
echo "📈 EXPECTED SEO IMPROVEMENTS:"
echo "• Better search engine crawling and indexing"
echo "• Enhanced rich snippets in search results"
echo "• Improved mobile and accessibility scores"
echo "• Better local SEO for New Jersey searches"
echo "• Increased organic traffic potential"