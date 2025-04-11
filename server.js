const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 5000;

// 使用 body-parser 處理 POST 請求
app.use(bodyParser.json());

// 設定你的 Grok API 金鑰和 URL
const apiKey = '你的_Grok_API_金鑰';
const apiUrl = 'https://api.grok.com/v1/message'; // Grok API 的 URL

// 聊天機器人邏輯
const getGrokResponse = async (userMessage) => {
    try {
        const response = await axios.post(apiUrl, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            data: { message: userMessage }
        });
        return response.data.reply;  // 根據 API 返回的結構調整
    } catch (error) {
        console.error('Error communicating with Grok API:', error);
        return "抱歉，我遇到了一點問題。";
    }
};

// API 路徑來處理用戶訊息
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    const botReply = await getGrokResponse(userMessage);
    res.json({ reply: botReply });
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
