import React from 'react';

export enum Page {
  HOME = 'HOME',
  WORKS = 'WORKS',
  ABOUT = 'ABOUT',
  STORE = 'STORE',
  CONTACT = 'CONTACT',
  CART = 'CART'
}

export interface WorkItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  videoId?: string; // Updated from videoUrl to match YouTube implementation
  size: 'small' | 'medium' | 'large' | 'tall';
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: React.ElementType;
}