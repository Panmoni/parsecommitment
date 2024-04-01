const parseCommitment = require("./parseCommitment");

test("parseCommitment extracts commitment data correctly", () => {
  const bytecode =
    "00cf527f780230348763786b587f786b6b67780230378763786b5c7f786b6b67786b587f786b5c7f786b6b7568687575";
  const commitment =
    "30313130313031303131323032333132313231393030313034333030303030";

  const result = parseCommitment(bytecode, commitment);

  expect(result).toEqual(["01", "10101011", "202312121900", "104300000"]);
});
