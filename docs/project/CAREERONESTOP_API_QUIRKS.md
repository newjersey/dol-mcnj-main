# CareerOneStop API - Known Quirks and Discrepancies

## Overview

This document describes known behavioral quirks with the CareerOneStop API that developers should be aware of when working with job count data.

## Job Count Discrepancies Between API and Website

### Issue Description

The job count returned by the CareerOneStop API may differ from the count shown on their public website (careeronestop.org) when searching for the same SOC code with identical parameters.

**Example:**
- **API Response**: 384 jobs for SOC code `41-2021`
- **Website Display**: 374 jobs for SOC code `41-2021` with same search parameters
- **Difference**: 10 jobs (~2.6%)

### Root Causes

The discrepancy is caused by CareerOneStop's infrastructure, not our code. Possible reasons include:

1. **Real-time changes** - Jobs are continuously posted and removed; the API and website may be queried at different times
2. **Caching strategies** - API and website likely have different cache refresh cycles
3. **Data sources** - API and website may pull from slightly different NLx job board indexes
4. **Client-side filtering** - The website may apply additional filters in the browser that the API doesn't

### Our Solution

We've taken the following steps to maximize accuracy and consistency:

#### 1. Matching API Parameters to Website
```typescript
// Backend API call now uses identical parameters to website
`${baseUrl}/v1/jobsearch/${userId}/${soc}/NJ/1000/0/0/0/10/0?source=NLX`
```

Key changes made (October 2025):
- Changed `source=NLx` (lowercase) → `source=NLX` (uppercase) to match website
- Removed `showFilters=false` parameter that website doesn't use

#### 2. Consistent SOC Code Usage
```typescript
// Frontend link uses the SAME SOC code as backend API call
url={`https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=${occupation.openJobsSoc || occupation.soc}&location=New%20Jersey&radius=0&source=NLX&currentpage=1`}
```

The `openJobsSoc` field ensures that when the backend falls back to a 2010 SOC code (because 2018 data isn't available from O*NET), both the API call and the website link use the same code.

### Expected Behavior

- **Internal consistency**: ✅ Our displayed job count and CareerOneStop link always use the same SOC code
- **External consistency**: ⚠️ Minor discrepancies (<5%) between our count and CareerOneStop's website are expected and acceptable

### Testing

To verify the current behavior:

```bash
# Test the API directly
curl -s 'https://api.careeronestop.org/v1/jobsearch/{userId}/{soc}/NJ/1000/0/0/0/10/0?source=NLX' \
  -H 'Authorization: Bearer {token}' | jq '.Jobcount'

# Compare with website
# Visit: https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword={soc}&location=New%20Jersey&radius=0&source=NLX&currentpage=1
```

### Developer Guidelines

When working with CareerOneStop job counts:

1. **Don't panic about small differences** - Variations of 2-5% are normal and expected
2. **Prioritize internal consistency** - Ensure our count and link use the same SOC code
3. **Document any parameter changes** - If modifying API calls, update this document
4. **Use `openJobsSoc` in links** - Always prefer `openJobsSoc || soc` in CareerOneStop URLs

### Related Code

- **API Client**: `backend/src/careeronestop/CareerOneStopClient.ts`
- **Frontend Link**: `src/app/occupation/[code]/Content.tsx` (line ~85)
- **Type Definition**: `backend/src/domain/occupations/Occupation.ts` (`openJobsSoc` field)
- **Business Logic**: `backend/src/domain/occupations/getOccupationDetail.ts` (sets `openJobsSoc`)

### External References

- [CareerOneStop API Documentation](https://www.careeronestop.org/Developers/WebAPI/web-api.aspx)
- [NLx Job Board Information](https://www.naswa.org/partnerships/nlx)

### Version History

- **October 20, 2025**: Initial documentation; changed API to use `source=NLX` for better website alignment
- **September 17, 2020**: Original CareerOneStop integration (active job openings count feature)

---

**Questions?** Contact the development team or check the main [README](../../README.md) for additional context.
