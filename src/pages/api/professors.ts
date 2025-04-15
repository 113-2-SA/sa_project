import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const dataPath = path.join(process.cwd(), 'data', 'training_data.txt');
    const professorData = fs.readFileSync(dataPath, 'utf-8');
    
    return res.status(200).json({ data: professorData });
  } catch (error: any) {
    console.error('Error reading professor data:', error);
    return res.status(500).json({ 
      message: 'Error reading professor data', 
      error: error?.message || 'Unknown error occurred' 
    });
  }
} 