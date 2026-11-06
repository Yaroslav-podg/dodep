import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('roulette.open', () => {
        const panel = vscode.window.createWebviewPanel(
            'roulette',
            'Рулетка 0–10',
            vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );

        panel.webview.html = getWebviewContent();
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}

function getWebviewContent(): string {
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Рулетка</title>
    <style>
        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background: #1e1e1e;
            color: #f0f0f0;
            text-align: center;
            padding: 24px;
            box-sizing: border-box;
        }

        h1 {
            margin-bottom: 8px;
            font-size: 28px;
        }

        .hint {
            opacity: 0.7;
            margin-bottom: 32px;
            font-size: 14px;
        }

        #number {
            font-size: 120px;
            font-weight: 800;
            line-height: 1;
            min-height: 140px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffd166;
            text-shadow: 0 0 24px rgba(255, 209, 102, 0.35);
            transition: transform 0.08s ease;
        }

        #number.spinning {
            transform: scale(1.08);
        }

        #result {
            margin-top: 24px;
            font-size: 28px;
            font-weight: 700;
            min-height: 40px;
            color: #8ecae6;
        }

        button {
            margin-top: 32px;
            padding: 12px 28px;
            font-size: 16px;
            font-weight: 600;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            background: #0e639c;
            color: white;
        }

        button:hover {
            background: #1177bb;
        }

        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    </style>
</head>
<body>
    <h1>Рулетка</h1>
    <div class="hint">Числа от 0 до 10. Нажмите «Крутить», чтобы испытать удачу.</div>

    <div id="number">?</div>
    <div id="result"></div>

    <button id="spinButton">Крутить</button>

    <script>
        const numberEl = document.getElementById('number');
        const resultEl = document.getElementById('result');
        const spinButton = document.getElementById('spinButton');

        let spinning = false;

        function getMessage(n) {
            if (n === 0) {
                return 'Неудача( Переписывай весь код!';
            }
            if (n >= 1 && n <= 5) {
                return 'Удали несколько функций';
            }
            if (n >= 6 && n <= 9) {
                return 'Неплохо, но все равно поработай';
            }
            if (n === 10) {
                return 'Красавчик!! Можешь отдохнуть)';
            }
            return '';
        }

        function spin() {
            if (spinning) {
                return;
            }

            spinning = true;
            spinButton.disabled = true;
            resultEl.textContent = '';
            numberEl.classList.add('spinning');

            let ticks = 0;
            const totalTicks = 30;

            const interval = setInterval(() => {
                const randomNumber = Math.floor(Math.random() * 11);
                numberEl.textContent = String(randomNumber);

                ticks++;

                if (ticks >= totalTicks) {
                    clearInterval(interval);

                    const finalNumber = Math.floor(Math.random() * 11);
                    numberEl.textContent = String(finalNumber);
                    resultEl.textContent = getMessage(finalNumber);

                    numberEl.classList.remove('spinning');
                    spinning = false;
                    spinButton.disabled = false;
                }
            }, 60);
        }

        spinButton.addEventListener('click', spin);

        // Запускаем рулетку сразу при открытии окна
        spin();
    </script>
</body>
</html>`;
}