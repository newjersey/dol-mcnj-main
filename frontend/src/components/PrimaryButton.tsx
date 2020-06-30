import { Button, withStyles } from "@material-ui/core";

export const PrimaryButton = withStyles({
  root: {
    background: "#000000",
    borderRadius: 10,
    border: 0,
    color: "white",
    height: 35,
    boxShadow: "0",
    textTransform: "none",
    fontWeight: "bold",
    fontSize: 16,
    width: 114,
    "&:hover": {
      backgroundColor: "#777777",
    },
  },
  label: {
    color: "white",
  },
})(Button);
