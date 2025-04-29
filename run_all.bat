@echo off
setlocal enabledelayedexpansion

echo.
echo ====== [啟動防呆批次流程] ======
echo.

:: 1. 確認 venv 資料夾是否存在
if not exist "venv" (
    echo [警告] 找不到 venv 虛擬環境，正在建立新的虛擬環境...
    "C:\Program Files\Python311\python.exe" -m venv venv
    if errorlevel 1 (
        echo [錯誤] 無法建立虛擬環境，請檢查 Python 是否安裝正確。
        pause
        exit /b
    )
    echo [完成] 虛擬環境建立成功。
) else (
    echo [OK] 已偵測到虛擬環境 venv。
)

:: 2. 啟動虛擬環境
echo.
echo [啟動] 正在啟動虛擬環境...
call venv\Scripts\activate
if errorlevel 1 (
    echo [錯誤] 啟動虛擬環境失敗。
    pause
    exit /b
)
echo [OK] 虛擬環境啟動成功。

:: 3. 更新 pip
echo.
echo [升級] 正在升級 pip 版本...
python -m pip install --upgrade pip

:: 4. 安裝 requirements.txt
echo.
if exist "requirements.txt" (
    echo [安裝] 正在安裝 requirements.txt 內套件...
    pip install -r requirements.txt
) else (
    echo [警告] 找不到 requirements.txt，跳過安裝套件！
)

:: 5. 執行你的主程式
echo.
echo [執行] 正在執行 process_qa_slice.py ...
python src\FAQ\process_qa_slice.py
if errorlevel 1 (
    echo [錯誤] 執行程式失敗。
    pause
    exit /b
)

echo.
echo ====== [流程完成 ✅ ] ======
pause
