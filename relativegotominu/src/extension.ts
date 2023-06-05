var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : new P(function (resolve) {
                          resolve(result.value);
                      }).then(fulfilled, rejected);
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
            );
        });
    };
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
let lineHighLight;
function activate(context) {
    lineHighLight = vscode.window.createTextEditorDecorationType({
        isWholeLine: true,
        borderColor: new vscode.ThemeColor("editor.lineHighlightBorder"),
        borderWidth: "2px",
        borderStyle: "solid",
        backgroundColor: new vscode.ThemeColor(
            "editor.lineHighlightBackground"
        ),
    });
    let disposable = vscode.commands.registerCommand(
        "extension.relativeGotoMinu",
        () =>
            __awaiter(this, void 0, void 0, function* () {
                let editor = vscode.window.activeTextEditor;
                // do nothing if there isn't an active editor
                if (editor) {
                    // get cursor position
                    let position = editor.selection.active;
                    //console.log((position.line + 1).toString());
                    // show input box
                    let result = yield vscode.window.showInputBox({
                        value: "0",
                        prompt: "Relative go to # of lines to jump",
                        ignoreFocusOut: true,
                        validateInput: peekline,
                    });
                    deleteHighlight(editor);
                    //get result
                    if (result) {
                        let jump = parseInt(result);
                        if (!(jump === Number.NaN) && !(jump === 0)) {
                            if (position.line + jump < 0) {
                                jump = -position.line;
                            }
                            // scroll to line
                            let moveTo = position.translate(jump);
                            editor.revealRange(
                                new vscode.Range(moveTo, moveTo),
                                vscode.TextEditorRevealType
                                    .InCenterIfOutsideViewport
                            );
                            // move cursor
                            vscode.commands.executeCommand("cursorMove", {
                                to: "up",
                                by: "line",
                                value: jump,
                            });
                        }
                    }
                }
            })
    );
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function peekline(value) {
    //console.log("validate " + value);
    let editor = vscode.window.activeTextEditor;
    if (editor) {
        if (value) {
            let position = editor.selection.active;
            let jump = parseInt(value);
            if (!(jump === Number.NaN) && !(jump === 0)) {
                //console.log("semi-valid " + position.line + " -> " + jump + " = " + (position.line + jump);
                //don't jump before line 0
                if (position.line + jump < 0) {
                    jump = -position.line;
                }
                //console.log("validated " + position.line + " -> " + jump + " = " + (position.line + jump);
                // scroll to line
                let moveTo = position.translate(jump);
                editor.revealRange(
                    new vscode.Range(moveTo, moveTo),
                    vscode.TextEditorRevealType.InCenterIfOutsideViewport
                );
                // highlight line
                const newDecoration = {
                    range: new vscode.Range(moveTo, moveTo),
                };
                editor.setDecorations(lineHighLight, [newDecoration]);
            } else {
                deleteHighlight(editor);
            }
        } else {
            deleteHighlight(editor);
        }
    }
    return null;
}
function deleteHighlight(editor) {
    editor.setDecorations(lineHighLight, []);
    editor.revealRange(
        new vscode.Range(editor.selection.active, editor.selection.active),
        vscode.TextEditorRevealType.InCenterIfOutsideViewport
    );
}
// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
