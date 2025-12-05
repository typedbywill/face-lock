import { exec } from "child_process";

export class WindowsLocker {
    async isLocked() {
        // Implementação complexa no Windows via CLI, por padrão retorna false 
        // ou precisaria de powershell call como:
        // Get-Process | Where-Object { $_.MainWindowTitle -ne "" } 
        // Mas para simplificar manteremos o comportamento original se houver
        return false;
    }

    async lock() {
        exec("rundll32.exe user32.dll,LockWorkStation");
    }
}
