import React from 'react';
import { EnhancedFestivalOverlay } from '../utils/festivalThemes';

interface FestivalOverlayProps {
  isActive: boolean;
  festivalId?: string;
}

export const FestivalOverlay: React.FC<FestivalOverlayProps> = ({ isActive, festivalId = 'diwali' }) => {
  return <EnhancedFestivalOverlay isActive={isActive} festivalId={festivalId} />;
};