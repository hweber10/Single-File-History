import { AbstractExecuteCommandHandler, ExecuteCommandAcceptor } from "langium/lsp";
import { generateDefaultProject } from "./single-file-history-commands.js";

export class SingleFileHistoryCommandHandler extends AbstractExecuteCommandHandler {
    registerCommands(acceptor: ExecuteCommandAcceptor): void {
        acceptor('generateDefaultProject', args => {
            return generateDefaultProject();
        });
    }
}