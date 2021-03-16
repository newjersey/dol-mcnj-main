import { Button, withStyles } from "@material-ui/core";

export const TertiaryButton = withStyles({
  root: {
    background: "#21456A",
    borderRadius: 10,
    border: 0,
    color: "white",
    boxShadow: "0",
    textTransform: "none",
    fontWeight: "bold",
    fontSize: 16,
    width: "100%",
    "&:hover": {
      backgroundColor: "#1668b4",
    },
  },
  label: {
    color: "white",
  },
})(Button);
