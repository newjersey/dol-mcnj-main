import app from "./app";

const port = Number(process.env.PORT || 8080);
app.listen(port, () => {
  try {
    console.log({ message: "Express server started on port: " + port, status: "info" });
  } catch (error: any) {
    console.log(error.message, "error");
  }
});
