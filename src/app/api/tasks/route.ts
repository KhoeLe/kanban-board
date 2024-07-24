import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const dataFilePath = path.join(process.cwd(), "data", "tasks.json");

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'GET') {
//     try {
//       const data = fs.readFileSync(dataFilePath, 'utf8');
//       res.status(200).json(JSON.parse(data));
//     } catch (error) {
//       res.status(500).json({ message: 'Error reading tasks' });
//     }
//   } else if (req.method === 'POST') {
//     try {
//       fs.writeFileSync(dataFilePath, JSON.stringify(req.body, null, 2));
//       res.status(200).json({ message: 'Tasks saved successfully' });
//     } catch (error) {
//       res.status(500).json({ message: 'Error saving tasks' });
//     }
//   } else {
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }

console.log("dataFilePath", dataFilePath);

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
    
    const data = await req.json()
    console.log('first data', data)
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    return NextResponse.json(
      { message: "Tasks saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error saving tasks" },
      { status: 500 }
    );
  }
}
