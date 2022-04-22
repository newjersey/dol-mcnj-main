import { ButtonBase, withStyles } from "@material-ui/core";

export const UnstyledLinkButton = withStyles({
  root: {
    textTransform: "none",
    fontWeight: "normal",
    fontSize: 16,
  },
})(ButtonBase);
