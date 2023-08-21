import path from "path";
import fs from "fs";

export const createFileDetails = (
  fileName: string
): {
  readonly filePath: string;
  readonly fileNameWithoutExtension: string;
  readonly fileExtension: string;
} => {
  const filePath = path.join(process.cwd(), fileName);
  const fileNameWithoutExtension = path.parse(filePath).name;
  const fileExtension = path.extname(filePath);

  return {
    filePath,
    fileNameWithoutExtension,
    fileExtension,
  };
};

export const getNewFileName = (fileName: string, suffix: string) => {
  const { fileNameWithoutExtension, fileExtension } =
    createFileDetails(fileName);
  return `${fileNameWithoutExtension}.${suffix}${fileExtension}`;
};

export const removePathPrefixFromCwd = (filePath: string) => {
  return path.dirname(filePath).replace(process.cwd(), "");
};

export const checkIfTestFileExists = (fileName: string): boolean => {
  const prefix = path.dirname(fileName).replace(process.cwd(), "");
  return (
    fs.existsSync(
      path.join(process.cwd(), prefix, getNewFileName(fileName, "spec"))
    ) ||
    fs.existsSync(
      path.join(process.cwd(), prefix, getNewFileName(fileName, "test"))
    )
  );
};
