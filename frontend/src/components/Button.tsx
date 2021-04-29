import { ButtonBase, withStyles } from "@material-ui/core";

export const Button = withStyles({
  root: {
    textTransform: "none",
    fontWeight: "bold",
    fontSize: 16,
  },
})(ButtonBase);
