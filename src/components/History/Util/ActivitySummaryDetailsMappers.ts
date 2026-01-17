import {
  IconCrosshair,
  IconCrown,
} from '@tabler/icons-react';
import { ActivitySummaryDetailType } from '../ActivitySummaryDetails';

export const ACTIVITY_DETAILS_ICON_MAP: Record<
  ActivitySummaryDetailType,
  { icon: React.ReactNode; label: string }
> = {
  TRANSACTION: {
    icon: <IconCrosshair size={18} />,
    label: 'Transaction',
  },
  SPACE_COMBAT: {
    icon: <IconCrown size={18} />,
    label: 'Space Combat',
  },
  GROUND_COMBAT: {
    icon: undefined,
    label: ''
  },
  SO_SCORED: {
    icon: undefined,
    label: ''
  },
  EXPLORE: {
    icon: undefined,
    label: ''
  },
  PRODUCTION: {
    icon: undefined,
    label: ''
  },
  RETREAT: {
    icon: undefined,
    label: ''
  },
  CONQUEST: {
    icon: undefined,
    label: ''
  }
};