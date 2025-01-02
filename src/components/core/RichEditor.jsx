import { useState } from 'react';
import Editor from 'react-simple-wysiwyg';


function RichEditor({richText,setRichText}) {
  
  function onChange(e) {
    setRichText(e.target.value);
  }

  return (
    <Editor value={richText} onChange={onChange} />
  );
}

export default RichEditor;