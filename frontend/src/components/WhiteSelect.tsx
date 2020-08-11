import { Select, withStyles } from "@material-ui/core";

export const WhiteSelect = withStyles({
  root: {
    paddingTop: "12px",
    paddingBottom: "11px",
    backgroundColor: "#FFFFFF",
    "&:focus": {
      backgroundColor: "#FFFFFF",
    },
  },
})(Select);
