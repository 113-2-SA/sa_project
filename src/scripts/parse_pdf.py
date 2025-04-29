import pdfplumber
import os

# 資料夾路徑
SOURCE_DIR = './src/utils/dataFiles'
OUTPUT_DIR = './src/utils/textOutput'

# 建立輸出資料夾
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 處理所有 PDF 檔案
for filename in os.listdir(SOURCE_DIR):
    if filename.endswith('.pdf'):
        pdf_path = os.path.join(SOURCE_DIR, filename)
        text_path = os.path.join(OUTPUT_DIR, filename.replace('.pdf', '.txt'))

        with pdfplumber.open(pdf_path) as pdf:
            text = ''
            for page in pdf.pages:
                text += page.extract_text() + '\n'

        with open(text_path, 'w', encoding='utf-8') as f:
            f.write(text)

        print(f"✅ 轉換完成：{filename} → {text_path}")
# 這段程式碼會將指定資料夾中的所有 PDF 檔案轉換為純文字檔案，並儲存在另一個資料夾中。
if __name__ == '__main__':
    try:
    # Ensure correct working directory
        script_dir = os.path.dirname(os.path.abspath(__file__))
        os.chdir(os.path.dirname(os.path.dirname(script_dir)))
    except Exception as e:
        print(f"❌ Error: {e}")