const path = "";
const navigation_paths = [
  { path: path + "/", label: "Home Page" },
  { path: path + "/training", label: "Training Explorer Page" },
  { path: path + "/search", label: "Search Page" },
  { path: path + "/training/44988", label: "Training Page" },
  { path: path + "/occupation/15-1254", label: "Occupation Page" },
  { path: path + "/funding", label: "Funding Page" },
  { path: path + "/career-pathways/:slug", label: "Career Pathways Page" },

  { path: path + "/privacy-policy", label: "Privacy Policy Page" },
  { path: path + "/terms-of-service", label: "Terms of Service Page" },
  { path: path + "/etpl", label: "ETPL Page" },
  {
    path: path + "/in-demand-occupations",
    label: "Indemand Occupations Page",
  },
  { path: path + "/support-resources", label: "Support Resource Page" },
  {
    path: path + "/support-resources/career-support",
    label: "Career Support Page",
  },
  {
    path: path + "/support-resources/tuition-assistance",
    label: "Tuition Assistance Page",
  },
  { path: path + "/support-resources/other", label: "Other Assistant Page" },
  {
    path: path + "/training-provider-resources",
    label: "Training Provider Resources Page",
  },
  // faq pages
  { path: path + "/faq", label: "FAQ Page" },
];

export default navigation_paths;
