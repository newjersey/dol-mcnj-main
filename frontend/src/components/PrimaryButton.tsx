import { Button, withStyles } from "@material-ui/core";

export const PrimaryButton = withStyles({
  root: {
    background: "#12263A",
    borderRadius: 10,
    border: 0,
    color: "white",
    boxShadow: "0",
    textTransform: "none",
    fontWeight: "bold",
    fontSize: 16,
    width: "100%",
    "&:hover": {
      backgroundColor: "#777777",
    },
  },
  label: {
    color: "white",
  },
})(Button);
