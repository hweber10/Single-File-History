import { CompletionItemKind, MarkupKind } from "vscode-languageserver"
import { CompletionAcceptor, NextFeature, CompletionContext } from "langium/lsp";
import { DefaultCompletionProvider } from "langium/lsp";

const exampleFile = 'version: 1.0\nproject:\n\tCBD-Number: CBD1\n\tPRJ-Number: PRJ1\n\ttitle: ""\n\tSDP-version: 1.0\nhistory:\n- ID: H1\n\tSub-project: XX\n\tDel: D00\n\tAuthor: ""\n\tDate: 0000-00-00\n\tTopic: ""\n\tDescription: ""\n\tType: Task\n\tDuedate: 0000-00-00\n\tResp: ""\n\tState: Closed'
const exampleHistory = 'Sub-project: XX\n\tDel: D00\n\tAuthor: ""\n\tDate: 0000-00-00\n\tTopic: ""\n\tDescription: ""\n\tType: Task\n\tDuedate: 0000-00-00\n\tResp: ""\n\tState: Closed'

export class SingleFileHistoryCompletionProvider extends DefaultCompletionProvider {

    protected override  async  completionFor(context: CompletionContext, next: NextFeature, acceptor: CompletionAcceptor): Promise<void> {
        await super.completionFor(context, next, acceptor);
        if (context.node?.$type === "Model") {
            acceptor(context, {
                label: "defaultProject",
                labelDetails: {description: "generates a default File"},
                kind: CompletionItemKind.Keyword,
                insertText: exampleFile,
                documentation: {kind: MarkupKind.Markdown, value: "This Code-Snippet automatically generates a default **Single-File-History File**."},
            })
        }
        if (context.node?.$type === "History") {
            acceptor(context, {
                label: ("addHistory"),
                labelDetails: {description: "generates a new History"},
                kind: CompletionItemKind.Keyword,
                insertText: '- ID: H'+(Number(context.node.$containerIndex)+2)+'\n\t'+exampleHistory,
                documentation: {kind: MarkupKind.Markdown, value: "This Code-Snippet automatically generates a default **History**."},
            })
        }
    }
}