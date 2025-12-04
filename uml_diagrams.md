# UML Diagrams for Course Registration System

## 1. Class Diagram

```mermaid
classDiagram
    class DataStore {
        -String STORE_KEY
        +load() Object
        +save(state) void
        +getCourses() Array
        +getStudents() Array
        +getRegistrations() Array
        +addOrUpdateCourse(course) void
        +deleteCourse(id) void
        +addOrUpdateStudent(student) void
        +deleteStudent(id) void
        +register(studentId, courseId) Object
        +unregister(regId) void
        +exportJSON() String
        +importJSON(jsonText) Object
        +clearAll() void
    }
    
    class Course {
        +String id
        +String code
        +String title
        +Number credits
    }
    
    class Student {
        +String id
        +String rollNo
        +String name
        +String email
    }
    
    class Registration {
        +String id
        +String studentId
        +String courseId
        +String timestamp
    }
    
    class UIHelper {
        +el(id) HTMLElement
        +showMsg(text, cls) void
        +uid(prefix) String
        +refreshAll() void
    }
    
    DataStore "1" --> "*" Course : manages
    DataStore "1" --> "*" Student : manages
    DataStore "1" --> "*" Registration : manages
    Registration "many" --> "1" Student : references
    Registration "many" --> "1" Course : references
    UIHelper ..> DataStore : uses
```

## 2. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    COURSE ||--o{ REGISTRATION : "has"
    STUDENT ||--o{ REGISTRATION : "enrolls in"
    
    COURSE {
        string id PK
        string code
        string title
        number credits
    }
    
    STUDENT {
        string id PK
        string rollNo
        string name
        string email
    }
    
    REGISTRATION {
        string id PK
        string studentId FK
        string courseId FK
        string timestamp
    }
```

## 3. Use Case Diagram

```mermaid
graph TB
    User[User/Administrator]
    
    subgraph "Course Management"
        UC1[Add Course]
        UC2[Edit Course]
        UC3[Delete Course]
        UC4[View Courses]
    end
    
    subgraph "Student Management"
        UC5[Add Student]
        UC6[Edit Student]
        UC7[Delete Student]
        UC8[View Students]
    end
    
    subgraph "Registration Management"
        UC9[Register Student]
        UC10[Unregister Student]
        UC11[View Registrations]
        UC12[Filter Registrations]
    end
    
    subgraph "Data Management"
        UC13[Export to JSON]
        UC14[Import from JSON]
        UC15[Clear All Data]
    end
    
    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7
    User --> UC8
    User --> UC9
    User --> UC10
    User --> UC11
    User --> UC12
    User --> UC13
    User --> UC14
    User --> UC15
```

## 4. Sequence Diagram - Register Student for Course

```mermaid
sequenceDiagram
    participant User
    participant UI as UI Component
    participant DS as DataStore
    participant LS as localStorage
    
    User->>UI: Select Student & Course
    User->>UI: Click Register Button
    UI->>DS: register(studentId, courseId)
    DS->>LS: load()
    LS-->>DS: Return current state
    DS->>DS: Validate student exists
    DS->>DS: Validate course exists
    DS->>DS: Check for duplicate
    DS->>DS: Create registration
    DS->>LS: save(updated state)
    LS-->>DS: Confirmation
    DS-->>UI: Return {ok: true}
    UI->>UI: refreshAll()
    UI->>UI: Update registration list
    UI->>User: Show success message
```

## 5. Sequence Diagram - Add Course

```mermaid
sequenceDiagram
    participant User
    participant Form as Course Form
    participant DS as DataStore
    participant LS as localStorage
    participant UI as UI Component
    
    User->>Form: Fill course details
    User->>Form: Click Submit
    Form->>Form: Validate input
    Form->>DS: addOrUpdateCourse(course)
    DS->>LS: load()
    LS-->>DS: Return current state
    alt Course exists
        DS->>DS: Update existing course
    else New course
        DS->>DS: Generate ID
        DS->>DS: Add new course
    end
    DS->>LS: save(updated state)
    LS-->>DS: Confirmation
    DS-->>Form: Success
    Form->>Form: Reset form
    Form->>UI: refreshAll()
    UI->>UI: Update course list
    UI->>User: Show success message
```

## 6. Activity Diagram - Data Import Process

```mermaid
flowchart TD
    Start([User clicks Choose File]) --> Select[Select JSON File]
    Select --> Read[Read File Content]
    Read --> Parse[Parse JSON]
    Parse --> Validate{Valid Structure?}
    Validate -->|No| Error[Show Error Message]
    Error --> End1([End])
    Validate -->|Yes| Save[Save to localStorage]
    Save --> Refresh[Call refreshAll]
    Refresh --> Update[Update UI]
    Update --> Success[Show Success Message]
    Success --> End2([End])
```

## 7. Component Diagram

```mermaid
graph TB
    subgraph "Presentation Layer"
        HTML[index.html<br/>UI Structure]
        CSS[style.css<br/>Styling]
    end
    
    subgraph "Business Logic Layer"
        JS[script.js<br/>Application Logic]
        DS[DataStore Module<br/>Data Management]
        UI[UI Helpers<br/>refreshAll, showMsg]
    end
    
    subgraph "Data Layer"
        LS[localStorage API<br/>Browser Storage]
    end
    
    subgraph "UI Components"
        CP[Course Panel]
        SP[Student Panel]
        RP[Registration Panel]
        DP[Data Management Panel]
    end
    
    HTML --> CSS
    HTML --> JS
    JS --> DS
    JS --> UI
    JS --> CP
    JS --> SP
    JS --> RP
    JS --> DP
    DS --> LS
    UI --> DS
```

## 8. State Diagram - Registration Lifecycle

```mermaid
stateDiagram-v2
    [*] --> NotRegistered: Initial State
    NotRegistered --> Registered: register(studentId, courseId)
    Registered --> Unregistered: unregister(regId)
    Unregistered --> Registered: register(studentId, courseId)
    Registered --> [*]: Course/Student Deleted
    NotRegistered --> [*]: Course/Student Deleted
```

## 9. Data Flow Diagram

```mermaid
flowchart LR
    User[User Input] --> Forms[HTML Forms]
    Forms --> JS[JavaScript Handlers]
    JS --> DS[DataStore]
    DS --> LS[(localStorage)]
    LS --> DS
    DS --> JS
    JS --> UI[UI Updates]
    UI --> User
    
    Export[Export Button] --> DS
    DS --> File[JSON File]
    
    Import[Import File] --> DS
    DS --> LS
```

## 10. Package Diagram

```mermaid
graph TB
    subgraph "Course Registration System"
        subgraph "Presentation Package"
            HTML_PKG[HTML Module]
            CSS_PKG[CSS Module]
        end
        
        subgraph "Business Logic Package"
            DS_PKG[DataStore Module]
            UI_PKG[UI Helper Module]
            EH_PKG[Event Handler Module]
        end
        
        subgraph "Data Package"
            LS_PKG[localStorage Module]
            JSON_PKG[JSON Serialization]
        end
    end
    
    HTML_PKG --> DS_PKG
    CSS_PKG --> HTML_PKG
    UI_PKG --> DS_PKG
    EH_PKG --> DS_PKG
    EH_PKG --> UI_PKG
    DS_PKG --> LS_PKG
    DS_PKG --> JSON_PKG
```
