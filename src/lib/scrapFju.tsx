import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeFJUCourseInfo() {
  const url = 'https://www.im.fju.edu.tw/%e5%a4%a7%e5%ad%b8%e9%83%a8%e8%aa%b2%e7%a8%8b%e8%b3%87%e8%a8%8a/';
  const res = await axios.get(url);
  const $ = cheerio.load(res.data);

  const contentList: string[] = [];

  $('.entry-content').find('p, li, table').each((_, el) => {
    const text = $(el).text().trim();
    if (text.length > 5) {
      contentList.push(text);
    }
  });

  return contentList;
}
