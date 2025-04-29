@echo off
echo 啟動虛擬環境...
call venv\Scripts\activate

echo 正在執行 process_qa_slice.py ...
python src\FAQ\process_qa_slice.py

pause
