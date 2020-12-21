import { Button, withStyles } from "@material-ui/core";

export const SecondaryButton = withStyles({
  root: {
    background: "#FFFFFF",
    borderRadius: 10,
    border: "1px solid #C4C4C4",
    color: "#1668b4",
    boxShadow: "0",
    textTransform: "none",
    fontWeight: "bold",
    fontSize: 16,
    width: "100%",
    "&:hover": {
      background: "#FFFFFF",
      border: "1px solid #000000",
    },
  },
  label: {
    color: "#1668b4",
  },
})(Button);
