grammar SingleFileHistory

entry Model:
    'version:' version = ID
    'project:' project = Project
    'history:' (history += History)*;

Project:
    'CBD-Number:' cbdnumber = ID
    'PRJ-Number:' prjnumber = ID
    'title:' title = STRING
    'SDP-version:' sdpversion = ID;

History:
'-' 'ID:' id = ID
    'Sub-project:' subproject = ID
    'Del:' del = ID
    'Author:' author = STRING
    'Date:' date = ID
    'Topic:' topic = STRING
    'Description:' description = STRING
    'Type:' type = ('Task' | 'Information')
    'Duedate:' duedate = ID
    'Resp:' resp = STRING
    'State:' state = ('Open' | 'Closed');




hidden terminal WS: /\s+/;
terminal CBDNUMBER: /CBD\d+/;
terminal PRJNUMBER: /PRJ\d+/;

terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;
terminal ID: /[\w\.\-]+/;


hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\#[^\n\r]*/;
