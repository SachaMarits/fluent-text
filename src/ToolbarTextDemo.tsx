import React, { useState } from 'react';
import FluentText, { FluentTextPlaceholder } from './FluentText';
import { FluentEditorFile } from './types/File';

// Composant de test pour visualiser ToolbarText
const ToolbarTextDemo: React.FC = () => {
  const [attachments, setAttachments] = useState<FluentEditorFile[]>([]);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <FluentText
        height={`${innerHeight - 150}px`}
        defaultValue={FluentTextPlaceholder}
        templates={[
          {
            id: 1,
            title: 'Template 1',
            contentBase64: 'VGVzdCBjb250ZW50IG9mIHRlbXBsYXRlIDE=',
          },
          {
            id: 2,
            title: 'Template 2',
            contentBase64: 'VGVzdCBjb250ZW50IG9mIHRlbXBsYXRlIDI=',
          },
        ]}
        showAttachments
        attachments={attachments}
        setAttachments={pj => setAttachments(pj)}
        hideGroupNames={innerWidth <= 992}
        responsive
        minified
        onContentChange={(content, base64Content) => {
          console.log('content', content);
          console.log('base64Content', base64Content);
        }}
      />
    </div>
  );
};

export default ToolbarTextDemo;
