MCP - Model Context Protocol

## Traditional LLMs like chatGPT, gemini or claudeAI are already good. Why should we learn about MCP
1. LLMs are not up-to-date. They may be updated till Jan 2025(current date is Dec 2025) and so they don't know yesterday or recent happenings
2. Limitation on Token Window size 
If a document is very huge and has tokens more than the limit LLM can process, then LLMs would fail to retrieve the results for the request. MCP server can provide relevant pages from the document with few tokens and help in providing accurate result to the user.
3. LLMs can't access your code repository, private changes or personal files. It's like getting treatment from a general doctor which is not as effective as visiting a specialist(cardiologist/neurologist) 
4. MCP server provides structured JSON output which LLMs can process easily. It's like giving smashed food to a toddler that is easy to digest.
5. We don't want LLMs that is simply guessing or hallucinating, but rather provide accurate results
6. A server is someone who serves your query. MCP server provides contextual information which is then passed to LLM context data+ actual query -> response , which will be precise.

MCP Host is someone who runs MCP client to communicate with MCP server.eg. VScode
MCP server can be local/remote. Local runs in same machine and remote runs in cloud.

STDIO/IN communication between Local MCP Server and Client 
HTTP/S communication between Remote MCP server and client

Server Primitives 
@mcp.tool
 tool - afunction will be executed to give response
@mcp.resource
resources - retrieves document/ DB data 
@mcp.prompt
Prompt- returns prompt related info to the client

## HOW TO START COMMUNICATION WITH MCP SERVER

1. start the server
2. client initiate message
3. send any primitive - tool/resource/prompt

## MCP INSPECTOR 
It is a tool, which acts like a MCP client to communicate with MCP server.
"method":"tools/list" - list all the functions that server can invoke
method":"tools/call - invokes function whose name will be present in params in json 
