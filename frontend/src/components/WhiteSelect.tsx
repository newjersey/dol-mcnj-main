import { Select, withStyles } from "@material-ui/core";

const styles = {
  root: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #8f8f9d",
    borderRadius: "3px",
    height: "32px",
    fontSize: "1rem",
    padding: "0.5rem",
    maxWidth: "100%",
    "&:focus": {
      backgroundColor: "#FFFFFF",
    },
  },
};

export const WhiteSelect = withStyles(styles)(Select);
