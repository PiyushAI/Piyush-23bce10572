# System Architecture Diagrams - Course Registration System

## 1. Layered Architecture Diagram

```mermaid
graph TB
    subgraph "PRESENTATION LAYER"
        HTML[index.html<br/>Semantic HTML5<br/>Forms, Lists, Structure]
        CSS[style.css<br/>CSS3 Styling<br/>Grid, Flexbox, Variables<br/>Responsive Design]
    end
    
    subgraph "APPLICATION LAYER"
        JS[script.js<br/>JavaScript ES6+<br/>Event Handlers<br/>Form Validation]
        DS[DataStore Module<br/>Data Management<br/>CRUD Operations<br/>Import/Export]
        UI[UI Helpers<br/>DOM Manipulation<br/>Message Display<br/>UI Refresh]
    end
    
    subgraph "DATA PERSISTENCE LAYER"
        LS[localStorage API<br/>Browser Storage<br/>JSON Serialization<br/>Key-Value Store]
    end
    
    HTML --> JS
    CSS --> HTML
    JS --> DS
    JS --> UI
    DS --> LS
    UI --> DS
    JS --> UI
```

## 2. Component Architecture Diagram

```mermaid
graph TB
    subgraph "User Interface Components"
        CM[Course Management<br/>Component]
        SM[Student Management<br/>Component]
        RM[Registration<br/>Component]
        DM[Data Management<br/>Component]
    end
    
    subgraph "Core Modules"
        DS[DataStore Module<br/>Singleton]
        UH[UI Helper Functions<br/>Utilities]
    end
    
    subgraph "Browser APIs"
        LS[localStorage API]
        FR[FileReader API]
        BL[Blob API]
        DOM[DOM API]
    end
    
    CM --> DS
    SM --> DS
    RM --> DS
    DM --> DS
    CM --> UH
    SM --> UH
    RM --> UH
    DM --> UH
    DS --> LS
    DM --> FR
    DM --> BL
    UH --> DOM
```

## 3. System Context Diagram (C4 Model - Level 1)

```mermaid
graph TB
    CRS[Course Registration<br/>System<br/><br/>Manages courses,<br/>students, and<br/>registrations]
    
    User[User<br/><br/>Administrator/<br/>Registrar]
    Browser[Web Browser<br/><br/>Chrome, Firefox,<br/>Safari, Edge]
    FileSystem[File System<br/><br/>JSON Import/<br/>Export]
    
    User -->|Uses| CRS
    CRS -->|Runs in| Browser
    CRS -->|Reads/Writes| FileSystem
    Browser -->|Provides Storage| CRS
```

## 4. Container Diagram (C4 Model - Level 2)

```mermaid
graph TB
    subgraph "Web Browser Container"
        HTML_APP[HTML Application<br/>index.html<br/><br/>UI Structure<br/>Forms<br/>Lists]
        JS_APP[JavaScript Application<br/>script.js<br/><br/>Business Logic<br/>Event Handlers<br/>Data Management]
        CSS_APP[CSS Application<br/>style.css<br/><br/>Styling<br/>Layout<br/>Theming]
        STORAGE[localStorage<br/><br/>Data Persistence<br/>Key: crs_data_v1]
    end
    
    USER[User]
    FS[File System<br/>External]
    
    USER -->|Interacts with| HTML_APP
    HTML_APP -->|Styled by| CSS_APP
    HTML_APP -->|Controlled by| JS_APP
    JS_APP -->|Reads/Writes| STORAGE
    JS_APP -->|Exports to| FS
    JS_APP -->|Imports from| FS
```

## 5. Component Diagram (C4 Model - Level 3)

```mermaid
graph TB
    subgraph "JavaScript Application Container"
        DS[DataStore<br/>Component<br/><br/>- load<br/>- save<br/>- CRUD operations<br/>- import/export]
        
        CM[Course Management<br/>Component<br/><br/>- Add course<br/>- Edit course<br/>- Delete course<br/>- List courses]
        
        SM[Student Management<br/>Component<br/><br/>- Add student<br/>- Edit student<br/>- Delete student<br/>- List students]
        
        RM[Registration<br/>Component<br/><br/>- Register<br/>- Unregister<br/>- Filter<br/>- List registrations]
        
        DM[Data Management<br/>Component<br/><br/>- Export JSON<br/>- Import JSON<br/>- Clear data]
        
        UH[UI Helper<br/>Component<br/><br/>- refreshAll<br/>- showMsg<br/>- el<br/>- uid]
    end
    
    LS[(localStorage)]
    
    CM --> DS
    SM --> DS
    RM --> DS
    DM --> DS
    CM --> UH
    SM --> UH
    RM --> UH
    DM --> UH
    DS --> LS
```

## 6. Data Flow Architecture Diagram

```mermaid
flowchart LR
    subgraph "User Input Flow"
        U1[User Input] --> F1[HTML Form]
        F1 --> EH[Event Handler]
        EH --> VAL[Validation]
        VAL --> DS1[DataStore]
        DS1 --> LS1[(localStorage)]
    end
    
    subgraph "Data Display Flow"
        LS2[(localStorage)] --> DS2[DataStore.load]
        DS2 --> RF[refreshAll]
        RF --> DOM[DOM Update]
        DOM --> U2[User View]
    end
    
    subgraph "Export Flow"
        LS3[(localStorage)] --> DS3[DataStore.exportJSON]
        DS3 --> BL[Blob Creation]
        BL --> DL[File Download]
    end
    
    subgraph "Import Flow"
        FS[File Selection] --> FR[FileReader]
        FR --> DS4[DataStore.importJSON]
        DS4 --> VAL2[Validation]
        VAL2 --> LS4[(localStorage)]
        LS4 --> RF2[refreshAll]
    end
```

## 7. Technology Stack Diagram

```mermaid
graph TB
    subgraph "Frontend Technologies"
        HTML5[HTML5<br/>- Semantic Elements<br/>- Forms<br/>- Accessibility]
        CSS3[CSS3<br/>- Grid Layout<br/>- Flexbox<br/>- Variables<br/>- Animations]
        JS[JavaScript ES6+<br/>- Arrow Functions<br/>- Template Literals<br/>- Destructuring<br/>- Modules]
    end
    
    subgraph "Browser APIs"
        LS_API[localStorage API<br/>Data Persistence]
        FR_API[FileReader API<br/>File Import]
        BL_API[Blob API<br/>File Export]
        DOM_API[DOM API<br/>UI Manipulation]
    end
    
    subgraph "Storage"
        STORAGE[Browser localStorage<br/>~5-10MB Limit<br/>Key-Value Store]
    end
    
    HTML5 --> DOM_API
    CSS3 --> HTML5
    JS --> LS_API
    JS --> FR_API
    JS --> BL_API
    JS --> DOM_API
    LS_API --> STORAGE
```

## 8. Deployment Architecture Diagram

```mermaid
graph TB
    subgraph "Static Files"
        HTML_FILE[index.html]
        CSS_FILE[style.css]
        JS_FILE[script.js]
    end
    
    subgraph "Hosting Options"
        GH[GitHub Pages]
        NET[Netlify]
        VER[Vercel]
        STATIC[Static Web Server]
        LOCAL[Local File System]
    end
    
    subgraph "Client Environment"
        BROWSER[Web Browser]
        STORAGE[localStorage]
    end
    
    HTML_FILE --> GH
    CSS_FILE --> GH
    JS_FILE --> GH
    
    HTML_FILE --> NET
    CSS_FILE --> NET
    JS_FILE --> NET
    
    HTML_FILE --> STATIC
    CSS_FILE --> STATIC
    JS_FILE --> STATIC
    
    HTML_FILE --> LOCAL
    
    GH --> BROWSER
    NET --> BROWSER
    STATIC --> BROWSER
    LOCAL --> BROWSER
    
    BROWSER --> STORAGE
```

## 9. Module Dependency Diagram

```mermaid
graph LR
    HTML[index.html] --> JS[script.js]
    CSS[style.css] --> HTML
    
    JS --> DS[DataStore]
    JS --> UH[UI Helpers]
    
    DS --> LS[localStorage]
    
    CM[Course Module] --> DS
    SM[Student Module] --> DS
    RM[Registration Module] --> DS
    DM[Data Module] --> DS
    
    CM --> UH
    SM --> UH
    RM --> UH
    DM --> UH
    
    UH --> DOM[DOM API]
    DM --> FR[FileReader]
    DM --> BL[Blob API]
```

## 10. Request-Response Flow (Simplified)

```mermaid
sequenceDiagram
    participant U as User
    participant UI as UI Component
    participant JS as JavaScript
    participant DS as DataStore
    participant LS as localStorage
    
    Note over U,LS: Add Course Flow
    U->>UI: Fill form & submit
    UI->>JS: Form submit event
    JS->>JS: Validate input
    JS->>DS: addOrUpdateCourse()
    DS->>LS: load()
    LS-->>DS: Return data
    DS->>DS: Update/add course
    DS->>LS: save()
    LS-->>DS: Confirmation
    DS-->>JS: Success
    JS->>UI: refreshAll()
    UI->>UI: Update DOM
    UI-->>U: Show success message
```

## 11. System Boundaries Diagram

```mermaid
graph TB
    subgraph "System Boundary - Course Registration System"
        subgraph "Internal Components"
            HTML_COMP[HTML Components]
            CSS_COMP[CSS Components]
            JS_COMP[JavaScript Components]
            DS_COMP[DataStore Module]
        end
    end
    
    subgraph "External Systems"
        BROWSER[Web Browser<br/>Runtime Environment]
        STORAGE[localStorage<br/>Browser Storage]
        FS[File System<br/>User's Computer]
    end
    
    HTML_COMP -.->|Rendered by| BROWSER
    CSS_COMP -.->|Applied by| BROWSER
    JS_COMP -.->|Executed by| BROWSER
    DS_COMP -.->|Uses| STORAGE
    DS_COMP -.->|Reads/Writes| FS
```

## 12. Architecture Decision Flow

```mermaid
flowchart TD
    START[System Requirements] --> Q1{Need Backend?}
    Q1 -->|No| CLIENT[Client-Side Only]
    Q1 -->|Yes| SERVER[Server Required]
    
    CLIENT --> Q2{Storage Solution?}
    Q2 -->|Simple| LS[localStorage]
    Q2 -->|Complex| IDB[IndexedDB]
    Q2 -->|Server| DB[Database]
    
    LS --> Q3{JavaScript Framework?}
    Q3 -->|No| VANILLA[Vanilla JS]
    Q3 -->|Yes| FRAMEWORK[React/Vue/Angular]
    
    VANILLA --> FINAL[Final Architecture:<br/>HTML + CSS + Vanilla JS<br/>+ localStorage]
    
    style FINAL fill:#90EE90
```

## 13. Component Interaction Diagram

```mermaid
graph TB
    USER[User] -->|1. Input| FORM[HTML Form]
    FORM -->|2. Submit| HANDLER[Event Handler]
    HANDLER -->|3. Validate| VALID[Validation Logic]
    VALID -->|4. Process| DS[DataStore]
    DS -->|5. Load| LS[(localStorage)]
    LS -->|6. Return| DS
    DS -->|7. Update| LS
    DS -->|8. Success| HANDLER
    HANDLER -->|9. Refresh| UI[UI Update]
    UI -->|10. Display| USER
```

## 14. Data Model Architecture

```mermaid
erDiagram
    DATASTORE ||--o{ COURSE : manages
    DATASTORE ||--o{ STUDENT : manages
    DATASTORE ||--o{ REGISTRATION : manages
    
    REGISTRATION }o--|| STUDENT : references
    REGISTRATION }o--|| COURSE : references
    
    DATASTORE {
        object load
        void save
        array getCourses
        array getStudents
        array getRegistrations
    }
    
    COURSE {
        string id
        string code
        string title
        number credits
    }
    
    STUDENT {
        string id
        string rollNo
        string name
        string email
    }
    
    REGISTRATION {
        string id
        string studentId
        string courseId
        string timestamp
    }
```

## 15. Security Architecture (Simplified)

```mermaid
graph TB
    subgraph "Client-Side Security"
        VALID[Input Validation<br/>- Email format<br/>- Course code pattern<br/>- Number ranges]
        XSS[XSS Prevention<br/>- DOM manipulation<br/>- No innerHTML<br/>- Text content]
        NO_AUTH[No Authentication<br/>Single-user app]
    end
    
    subgraph "Data Security"
        NO_ENC[No Encryption<br/>Plain text in localStorage]
        BROWSER[Browser Security<br/>Same-origin policy]
        NO_NET[No Network<br/>No data transmission]
    end
    
    VALID --> USER[User Input]
    XSS --> DOM[DOM Updates]
    NO_AUTH --> ACCESS[Access Control]
    
    NO_ENC --> STORAGE[localStorage]
    BROWSER --> STORAGE
    NO_NET --> ISOLATION[Data Isolation]
```

---

## How to Use These Diagrams

### Option 1: GitHub/GitLab
- These Mermaid diagrams render automatically in markdown files
- Copy into your README.md or documentation

### Option 2: Mermaid Live Editor
1. Go to https://mermaid.live
2. Copy any diagram code
3. Paste and export as PNG/SVG

### Option 3: VS Code
1. Install "Markdown Preview Mermaid Support"
2. Preview markdown to see rendered diagrams

### Option 4: Documentation Tools
- Works with Notion, Obsidian, Confluence (with plugin)

---

## Diagram Descriptions

1. **Layered Architecture**: Shows 3-layer separation (Presentation, Application, Data)
2. **Component Architecture**: Shows all system components and their relationships
3. **System Context (C4)**: High-level view of system in its environment
4. **Container Diagram (C4)**: Shows containers within the system
5. **Component Diagram (C4)**: Shows components within containers
6. **Data Flow**: Shows how data moves through the system
7. **Technology Stack**: Shows all technologies used
8. **Deployment**: Shows deployment options and structure
9. **Module Dependencies**: Shows module relationships
10. **Request-Response Flow**: Shows interaction sequences
11. **System Boundaries**: Shows what's inside vs outside the system
12. **Architecture Decisions**: Shows decision-making process
13. **Component Interaction**: Shows component communication
14. **Data Model**: Shows data structure and relationships
15. **Security Architecture**: Shows security considerations

---

## Customization Tips

- Change colors: Add theme configuration
- Add more details: Expand component descriptions
- Include error flows: Add error handling paths
- Add performance notes: Include optimization points
- Show scalability: Add scaling considerations

Example with custom theme:
```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#ff6b6b'}}}%%
graph TB
    ...
```

