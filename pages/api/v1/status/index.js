function status(request, response) {
  response.status(200).json({ ludmilo: "deu bom ludmilo" });
}

export default status;
