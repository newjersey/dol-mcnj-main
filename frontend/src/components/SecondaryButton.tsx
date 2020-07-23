import { Button, withStyles } from "@material-ui/core";

export const SecondaryButton = withStyles({
  root: {
    background: "#FFFFFF",
    borderRadius: 10,
    border: "1px solid #E5E5E5",
    color: "#5C5858",
    boxShadow: "0",
    textTransform: "none",
    fontWeight: "bold",
    fontSize: 16,
    width: "100%",
    "&:hover": {
      backgroundColor: "#DDDDDD",
    },
  },
  label: {
    color: "#5C5858",
  },
})(Button);
