import { ButtonBase, withStyles } from "@material-ui/core";

export const UnstyledButton = withStyles({
  root: {
    textTransform: "none",
    fontWeight: "bold",
    fontSize: 16,
  },
})(ButtonBase);
