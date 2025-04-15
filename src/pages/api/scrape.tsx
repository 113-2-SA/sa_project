import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

interface Professor {
  name: string;
  title: string;
  expertise: string[];
  phone: string;
  email: string;
  office: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 確保 data 目錄存在
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // 抓取網頁內容
    const response = await axios.get('https://www.im.fju.edu.tw/%e5%b0%88%e4%bb%bb%e6%95%99%e5%b8%ab/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const html = response.data;
    const $ = cheerio.load(html);
    
    const professors: Professor[] = [];
    
    // 找到所有教授區塊
    $('h2').each((_, element) => {
      const section = $(element);
      const nameText = section.text().trim();
      
      // 跳過非教授區塊
      if (!nameText || nameText === '專任教師 (新)' || nameText === '聯絡資訊' || nameText === '學校地理位置') {
        return;
      }

      // 提取教授資訊
      const infoSection = section.next();
      const expertise = infoSection.find('li:contains("專長")').text().replace('▪ 專長', '').trim().split('、');
      const phone = infoSection.find('li:contains("電話")').text().replace('▪ 電話', '').trim();
      const email = infoSection.find('li:contains("信箱")').text().replace('▪ 信箱', '').trim();
      const office = infoSection.find('li:contains("辦公室位置")').text().replace('▪ 辦公室位置', '').trim();

      // 解析姓名和職稱
      const nameTitleMatch = nameText.match(/^(.+?)\s*([^教授副助理]*(?:教授|副教授|助理教授).*)$/);
      const name = nameTitleMatch ? nameTitleMatch[1].trim() : nameText;
      const title = nameTitleMatch ? nameTitleMatch[2].trim() : '';

      professors.push({
        name,
        title,
        expertise: expertise.filter(e => e), // 移除空字串
        phone,
        email,
        office
      });
    });

    // 儲存為 JSON 檔案
    fs.writeFileSync(
      path.join(dataDir, 'professors.json'),
      JSON.stringify(professors, null, 2),
      'utf-8'
    );

    // 建立訓練資料文字檔
    let trainingText = '';
    professors.forEach(prof => {
      trainingText += `教師姓名：${prof.name}\n`;
      trainingText += `職稱：${prof.title}\n`;
      trainingText += `專長：${prof.expertise.join('、')}\n`;
      trainingText += `聯絡電話：${prof.phone}\n`;
      trainingText += `電子郵件：${prof.email}\n`;
      trainingText += `辦公室位置：${prof.office}\n\n`;
    });

    fs.writeFileSync(
      path.join(dataDir, 'training_data.txt'),
      trainingText,
      'utf-8'
    );

    return res.status(200).json({
      message: '成功抓取教師資料',
      professorCount: professors.length,
      professors: professors
    });
  } catch (error: any) {
    console.error('抓取資料時發生錯誤:', error);
    return res.status(500).json({ 
      message: '抓取資料時發生錯誤', 
      error: error?.message || '未知錯誤' 
    });
  }
}
