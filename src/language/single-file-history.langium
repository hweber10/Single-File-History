grammar SingleFileHistory

entry Model:
    'Version:' version = ID
    'Project:' project = Project
    'History:' (history += History)*;

Project:
    'CBD-Number:' cbdnumber = STRING
    'PRJ-Number:' prjnumber = STRING
    'Title:' title = STRING
    'SDP-Version:' sdpversion = ID;

History:
'-' 'ID:' id = STRING
    'Sub-Project:' subproject = STRING
    'Del:' del = STRING
    'Author:' author = STRING
    'Date:' date = ID
    'Topic:' topic = STRING
    'Description:' description = STRING
    'Type:' type = STRING
    'Duedate:' duedate = ID
    'Resp:' resp = STRING
    'State:' state = STRING;




hidden terminal WS: /\s+/;

terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;
terminal ID: /[\w\.\-]+/;


hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\#[^\n\r]*/;
