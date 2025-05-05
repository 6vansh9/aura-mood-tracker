import { useState, useCallback } from 'react';
import type { EditorState } from '@/types';

export const useEditor = (): EditorState => {
  const [content, setContentState] = useState('');
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const handleChange = useCallback((newContent: string) => {
    setContentState(newContent);
  }, []);

  const handleSelectionChange = useCallback((start: number, end: number) => {
    setSelection({ start, end });
  }, []);

  const insertText = useCallback((text: string) => {
    const before = content.substring(0, selection.start);
    const after = content.substring(selection.end);
    const newContent = before + text + after;
    setContentState(newContent);
    setSelection({
      start: selection.start + text.length,
      end: selection.start + text.length,
    });
  }, [content, selection]);

  const formatText = useCallback((format: 'bold' | 'italic' | 'underline') => {
    const selectedText = content.substring(selection.start, selection.end);
    let formattedText = selectedText;

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
    }

    const before = content.substring(0, selection.start);
    const after = content.substring(selection.end);
    const newContent = before + formattedText + after;
    setContentState(newContent);
  }, [content, selection]);

  const addLink = useCallback((url: string) => {
    const selectedText = content.substring(selection.start, selection.end);
    const linkText = selectedText || url;
    const markdownLink = `[${linkText}](${url})`;
    
    const before = content.substring(0, selection.start);
    const after = content.substring(selection.end);
    const newContent = before + markdownLink + after;
    setContentState(newContent);
  }, [content, selection]);

  const addImage = useCallback((url: string) => {
    const markdownImage = `![Image](${url})`;
    insertText(markdownImage);
  }, [insertText]);

  const getContent = useCallback(() => {
    return content;
  }, [content]);

  const setContent = useCallback((newContent: string) => {
    setContentState(newContent);
  }, []);

  const toggleBlockType = useCallback((type: string) => {
    const selectedText = content.substring(selection.start, selection.end);
    let formattedText = selectedText;

    switch (type) {
      case 'unordered-list-item':
        formattedText = `- ${selectedText}`;
        break;
      case 'ordered-list-item':
        formattedText = `1. ${selectedText}`;
        break;
      case 'heading-one':
        formattedText = `# ${selectedText}`;
        break;
      case 'heading-two':
        formattedText = `## ${selectedText}`;
        break;
      case 'heading-three':
        formattedText = `### ${selectedText}`;
        break;
      case 'blockquote':
        formattedText = `> ${selectedText}`;
        break;
      case 'code-block':
        formattedText = `\`\`\`\n${selectedText}\n\`\`\``;
        break;
    }

    const before = content.substring(0, selection.start);
    const after = content.substring(selection.end);
    const newContent = before + formattedText + after;
    setContentState(newContent);
  }, [content, selection]);

  const toggleInlineStyle = useCallback((style: string) => {
    const selectedText = content.substring(selection.start, selection.end);
    let formattedText = selectedText;

    switch (style) {
      case 'BOLD':
        formattedText = `**${selectedText}**`;
        break;
      case 'ITALIC':
        formattedText = `*${selectedText}*`;
        break;
      case 'UNDERLINE':
        formattedText = `__${selectedText}__`;
        break;
      case 'CODE':
        formattedText = `\`${selectedText}\``;
        break;
    }

    const before = content.substring(0, selection.start);
    const after = content.substring(selection.end);
    const newContent = before + formattedText + after;
    setContentState(newContent);
  }, [content, selection]);

  const handleKeyCommand = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          formatText('bold');
          break;
        case 'i':
          e.preventDefault();
          formatText('italic');
          break;
        case 'u':
          e.preventDefault();
          formatText('underline');
          break;
      }
    }
  }, [formatText]);

  return {
    content,
    selection,
    handleChange,
    handleSelectionChange,
    insertText,
    formatText,
    addLink,
    addImage,
    getContent,
    setContent,
    toggleBlockType,
    toggleInlineStyle,
    handleKeyCommand,
  };
}; 