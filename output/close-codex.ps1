Start-Sleep -Seconds 15
$taskApp = Get-Process -Id 20760 -ErrorAction SilentlyContinue
if ($taskApp -and $taskApp.Path -like 'C:\Program Files\WindowsApps\OpenAI.Codex_*\app\ChatGPT.exe' -and $taskApp.MainWindowHandle -ne 0) {
    $taskClosed = $taskApp.CloseMainWindow()
    $taskClosed | Set-Content -LiteralPath 'C:\Users\tazwa\Desktop\Domiorum Architects\output\codex-close-result.txt'
}
