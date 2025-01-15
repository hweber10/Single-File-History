import { CompletionItemKind, MarkupKind } from "vscode-languageserver"
import { CompletionAcceptor, NextFeature, CompletionContext } from "langium/lsp";
import { DefaultCompletionProvider } from "langium/lsp";

export const exampleFile = 'Version: 1.0\nProject:\n    CBD-Number: "CBD1"\n    PRJ-Number: "PRJ1"\n    Title: ""\n    SDP-Version: 1.0\nHistory:\n- ID: "H1"\n    Sub-Project: ""\n    Del: "D1"\n    Author: ""\n    Date: 0000-00-00\n    Topic: ""\n    Description: ""\n    Type: "Task"\n    Duedate: 0000-00-00\n    Resp: ""\n    State: "Closed"';
const exampleHistory = 'Sub-Project: ""\n    Del: "D1"\n    Author: ""\n    Date: 0000-00-00\n    Topic: ""\n    Description: ""\n    Type: "Task"\n    Duedate: 0000-00-00\n    Resp: ""\n    State: "Closed"';

export class SingleFileHistoryCompletionProvider extends DefaultCompletionProvider {

    protected override  async  completionFor(context: CompletionContext, next: NextFeature, acceptor: CompletionAcceptor): Promise<void> {
        await super.completionFor(context, next, acceptor);
        if (context.node?.$type === "Model") {
            acceptor(context, {
                label: "defaultProject",
                labelDetails: {description: "generates a default File"},
                kind: CompletionItemKind.Keyword,
                insertText: exampleFile,
                insertTextMode: 1,
                documentation: {kind: MarkupKind.Markdown, value: "This Code-Snippet automatically generates a default **Single-File-History File**."},
            })
        }
        if (context.node?.$type === "History") {
            acceptor(context, {
                label: ("addHistory"),
                labelDetails: {description: "generates a new History"},
                kind: CompletionItemKind.Keyword,
                insertText: '\n- ID: "H'+(Number(context.node.$containerIndex)+2)+'"\n    '+exampleHistory,
                insertTextMode: 1,
                documentation: {kind: MarkupKind.Markdown, value: "This Code-Snippet automatically generates a default **History**."},
            })
        }
    }
}