import { Checkbox, withStyles } from "@material-ui/core";

export const SpacedCheckbox = withStyles({
  root: {
    paddingTop: 3,
    paddingBottom: 3,
  },
})(Checkbox);
