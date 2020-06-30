import { OutlinedInput, withStyles } from "@material-ui/core";

export const Input = withStyles({
  root: {
    background: "white",
    borderRadius: 10,
    height: 38,
    boxShadow: "0",
    width: 382,
    fontSize: 16,
    borderColor: "#7B7777",
  },
})(OutlinedInput);
