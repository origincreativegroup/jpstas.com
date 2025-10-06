# 📦 Dependencies Added for Portfolio System

## New Packages Installed

### 1. `@hello-pangea/dnd`
**Purpose**: Drag-and-drop functionality  
**Used in**: ProjectEditor component for reordering sections  
**Version**: Latest  

**Features**:
- Drag and drop sections in project editor
- Smooth animations
- Keyboard accessible
- Touch-friendly for mobile

### 2. `uuid`
**Purpose**: Generate unique IDs  
**Used in**: Template service for creating projects and sections  
**Version**: Latest  

**Features**:
- Generate unique project IDs
- Generate unique section IDs
- RFC4122 compliant UUIDs

---

## Installation Commands

If you need to reinstall:

```bash
npm install @hello-pangea/dnd uuid
```

Or install all dependencies:

```bash
npm install
```

---

## Usage

### Drag-and-Drop in ProjectEditor

```tsx
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

<DragDropContext onDragEnd={handleSectionReorder}>
  <Droppable droppableId="sections">
    {(provided) => (
      <div {...provided.droppableProps} ref={provided.innerRef}>
        {sections.map((section, index) => (
          <Draggable key={section.id} draggableId={section.id} index={index}>
            {/* Section content */}
          </Draggable>
        ))}
      </div>
    )}
  </Droppable>
</DragDropContext>
```

### UUID Generation

```typescript
import { v4 as uuidv4 } from 'uuid';

const projectId = uuidv4();  // e.g., "550e8400-e29b-41d4-a716-446655440000"
```

---

## Package Details

### @hello-pangea/dnd
- **Repository**: https://github.com/hello-pangea/dnd
- **Documentation**: https://github.com/hello-pangea/dnd/blob/main/README.md
- **Fork of**: react-beautiful-dnd (now maintained)
- **License**: Apache 2.0

### uuid
- **Repository**: https://github.com/uuidjs/uuid
- **Documentation**: https://github.com/uuidjs/uuid#readme
- **License**: MIT

---

## Troubleshooting

### Error: Cannot resolve '@hello-pangea/dnd'

**Solution**:
```bash
npm install @hello-pangea/dnd
```

### Error: Cannot find module 'uuid'

**Solution**:
```bash
npm install uuid
```

### Type errors with TypeScript

**Solution**: Types are included in both packages, no need for @types packages.

---

## Security Notes

Both packages have been audited and are safe to use:
- No known critical vulnerabilities
- Actively maintained
- Large community usage

Current audit shows:
- 4 vulnerabilities (2 low, 2 moderate) in overall project
- None critical or related to these new packages

To fix known issues:
```bash
npm audit fix
```

---

**Both packages are now installed and ready to use!** ✅

