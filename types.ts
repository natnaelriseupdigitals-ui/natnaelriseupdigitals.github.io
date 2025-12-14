import React from 'react';

export enum Page {
  HOME = 'HOME',
  WORKS = 'WORKS',
  ABOUT = 'ABOUT',
  CONTACT = 'CONTACT'
}

export interface WorkItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  videoUrl?: string; // Optional video preview
  size: 'small' | 'medium' | 'large' | 'tall';
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: React.ElementType;
}