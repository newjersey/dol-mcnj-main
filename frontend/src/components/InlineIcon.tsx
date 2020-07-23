import { withStyles, Icon } from "@material-ui/core";

export const InlineIcon = withStyles({
  root: {
    fontSize: "1rem",
    height: "auto",
    alignSelf: "flex-start",
    lineHeight: "inherit",
  },
})(Icon);
