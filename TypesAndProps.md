

<div align="center">

# Types and Props

[Types](#types) • [Props](#props)

</div>

## Types

### FluentEditorTemplate

```typescript
interface FluentEditorTemplate {
  id: number;
  title: string;
  content?: string;
  contentBase64?: string;
}
```

### Variable

```typescript
interface Variable {
  name: string;
  value: string;
}
```

### FluentEditorFile

```typescript
interface FluentEditorFile {
  id: number;
  name: string;
  url?: string;
  size?: number;
}
```

## Props

### Basic Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | `'text-editor-document-text'` | Unique identifier for the editor instance |
| `defaultValue` | `string` | `''` | Initial HTML content |
| `defaultValueIsBase64` | `boolean` | `false` | Whether `defaultValue` is base64 encoded |

### Layout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `vertical` | `boolean` | `false` | Display toolbar vertically below the editor |
| `textWidth` | `string` | `'600px'` | Width of the editor content area |
| `height` | `string \| number` | `'auto'` | Height of the editor |
| `responsive` | `boolean` | `false` | Enable responsive behavior |
| `className` | `string` | `''` | Additional CSS classes |

### Toggle Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `hideTitles` | `boolean` | `false` | Hide section titles in toolbar |
| `hideGroupNames` | `boolean` | `false` | Hide group names in toolbar |
| `showAttachments` | `boolean` | `false` | Show attachments panel |
| `input` | `boolean` | `false` | Use input mode (minimal toolbar) |
| `disabled` | `boolean` | `false` | Disable editing |
| `emailFormat` | `boolean` | `true` | Generate email-compatible HTML |
| `minified` | `boolean` | `false` | Output minified HTML |
| `noPadding` | `false` | `false` | Remove default padding |

### Options Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `string[]` | `['text', 'color', 'image', 'layout', 'element']` | Enabled toolbar sections |
| `textOptions` | `string[]` | `['style', 'alignment', 'link', 'font', 'variable']` | Enabled text formatting options |
| `language` | `'en' \| 'fr'` | `'en'` | Interface language |

### External Data Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `templates` | `FluentEditorTemplate[]` | `undefined` | Array of reusable templates |
| `variables` | `Variable[]` | `[]` | Array of variables for dynamic content |
| `attachments` | `FluentEditorFile[]` | `[]` | Array of file attachments |
| `setAttachments` | `React.Dispatch<React.SetStateAction<FluentEditorFile[]>>` | `() => {}` | Callback to update attachments |
| `onContentChange` | `(htmlContent: string, base64Content: string) => void` | `undefined` | Callback fired on content change (debounced) |