```mermaid
sequenceDiagram
    participant Mr. notetaker
    participant browser
    participant server

    Mr. notetaker->>browser: Writes: "Haluan sauna", clicks "Save"
    activate browser
    browser->>server: 302 found (URL redirect) causing reload
    activate server
    Note Appends new note to data.json
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server


    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: Sends updated JSON file "data.json"
    deactivate server

```
