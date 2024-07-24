import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const dataFilePath = path.join(process.cwd(), "data", "work-items.json");

export async function GET(request: Request) {
  try {
    // Assuming the commented-out code is the intended operation
    const data = fs.readFileSync(dataFilePath, "utf8");
    return NextResponse.json(JSON.parse(data), { status: 200 });
  } catch (error) {
    // Correctly return a response in the catch block
    console.log(error);
    return NextResponse.json(
      { message: "Error reading tasks" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("first data", data);
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    return NextResponse.json(
      { message: "Work item saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error saving tasks" },
      { status: 500 }
    );
  }
}
