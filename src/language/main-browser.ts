import { EmptyFileSystem } from 'langium';
import { startLanguageServer } from 'langium/lsp';
import { BrowserMessageReader, BrowserMessageWriter, createConnection } from 'vscode-languageserver/browser.js';
// your services & module name may differ based on your language's name
import { createSingleFileHistoryServices } from './single-file-history-module.js';

declare const self: DedicatedWorkerGlobalScope;

/* browser specific setup code */
const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

const connection = createConnection(messageReader, messageWriter);

// Inject the shared services and language-specific services
const { shared } = createSingleFileHistoryServices({connection, ...EmptyFileSystem });

// Start the language server with the shared services
startLanguageServer(shared);
