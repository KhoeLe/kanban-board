'use server'
import path from "path";
import fs from "fs";
import { WorkItemType } from "@/components/work-items/column";
import { revalidatePath } from "next/cache";

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

export const addWorkItem = async (workItem: WorkItemType) => {
  try {
    const readData = await fs.readFileSync(dataFilePath, "utf8");
    const workItems = JSON.parse(readData);

    workItems.push(workItem);

    await fs.writeFileSync(dataFilePath, JSON.stringify(workItems, null, 2));

    revalidatePath('/work-items');
    return {
      success: true,
      message: "Work item added successfully",
    }
    
    
  } catch (error) {
    console.error(error);
  }
}

export const updateWorkItem = async (workItem: WorkItemType) => {
  try {
    const readData = await fs.readFileSync(dataFilePath, "utf8");
    const workItems = JSON.parse(readData);

    const updatedItems = workItems.map((item: WorkItemType) => {
      if (item.id === workItem.id) {
        return workItem;
      }
      return item;
    });

    await fs.writeFileSync(dataFilePath, JSON.stringify(updatedItems, null, 2));

    revalidatePath('/work-items');
    return {
      success: true,
      message: "Work item updated successfully",
    }
  } catch (error) {
    console.error(error);
  }
}


export const removeWorkItem = async (id: number) => {
  try {
    const readData = await fs.readFileSync(dataFilePath, "utf8");
    const workItems = JSON.parse(readData);

    const filteredItems = workItems.filter((item: WorkItemType) => item.id !== id);

    await fs.writeFileSync(dataFilePath, JSON.stringify(filteredItems, null, 2));

    revalidatePath('/work-items');
    return {
      success: true,
      message: "Work item removed successfully",
    }
  } catch (error) {
    console.error(error);
  }
}