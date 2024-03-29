import fs from "fs/promises";

export const loadTempData = async () => {
  try {
    const data = await fs.readFile("data.json", "utf8");
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (error) {
    console.error(`Error reading the JSON file: ${JSON.stringify(error)}`);
  }
};

loadTempData();
