import path from "path";
import fs from "fs";

const dataFilePath = path.join(process.cwd(), "data", "work-items.json");
const dataFilePathRequest = path.join(process.cwd(), "data", "requests.json");


export const getWorkItems = async () => {
  try {
    const readData = await fs.readFileSync(dataFilePath, "utf8");

    return JSON.parse(readData);
  } catch (error) {
    console.error(error);
  }
};

export const getRequests = async () => {
  try {
    const readData = await fs.readFileSync(dataFilePathRequest, "utf8");

    return JSON.parse(readData);
  } catch (error) {
    console.error(error);
  }
}