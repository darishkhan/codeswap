import * as vscode from "vscode";

let firstBlock: string = "";
let startBlock: vscode.Position;
let endBlock: vscode.Position;
const editor = vscode.window.activeTextEditor;

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "codeswap.swapText",
    async () => {
      if (editor) {
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        if (selection && selectedText) {
          if (firstBlock === "") {
            vscode.window.setStatusBarMessage("Text selected `: P", 1000);
            firstBlock = selectedText;
            startBlock = selection.start;
            endBlock = selection.end;
          } else {
            vscode.window.setStatusBarMessage("Text swapped :D", 1000);
            let firstRange = new vscode.Range(startBlock, endBlock);
            let secondRange = new vscode.Range(selection.start, selection.end);
            let firstText = firstBlock;
            let secondText = selectedText;
            const ranges = [
              { range: firstRange, text: secondText },
              { range: secondRange, text: firstText },
            ];

            ranges.sort((a, b) => b.range.start.compareTo(a.range.start));

            await editor.edit((editBuilder) => {
              for (const r of ranges) {
                editBuilder.replace(r.range, r.text);
              }
            });
            firstBlock = "";
            startBlock = endBlock;
          }
        }
      }
    },
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
