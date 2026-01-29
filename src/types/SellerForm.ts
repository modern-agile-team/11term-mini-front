import React from 'react';

export type InputType = 'text' | 'textarea' | 'number' | 'image' | 'custom';

export interface SectionProps {
  label: string;
  type?: InputType;
  name?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  maxLength?: number;
  count?: string;
  description?: string;
  required?: boolean;
  isLast?: boolean;
  unit?: string;
  children?: React.ReactNode;
  images?: string[];
  onImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage?: (index: number) => void;
}
