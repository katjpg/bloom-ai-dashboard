// Core Enums from Backend
export enum PIIType {
  ACCOUNTNUM = "ACCOUNTNUM",
  BUILDINGNUM = "BUILDINGNUM", 
  CITY = "CITY",
  CREDITCARDNUMBER = "CREDITCARDNUMBER",
  DATEOFBIRTH = "DATEOFBIRTH",
  DRIVERLICENSENUM = "DRIVERLICENSENUM",
  EMAIL = "EMAIL",
  GIVENNAME = "GIVENNAME",
  IDCARDNUM = "IDCARDNUM", 
  PASSWORD = "PASSWORD",
  SOCIALNUM = "SOCIALNUM",
  STREET = "STREET",
  SURNAME = "SURNAME",
  TAXNUM = "TAXNUM",
  TELEPHONENUM = "TELEPHONENUM",
  USERNAME = "USERNAME",
  ZIPCODE = "ZIPCODE"
}

export enum ContentType {
  OK = "OK",           // Safe content
  S = "S",             // Sexual content
  H = "H",             // Hate speech
  V = "V",             // Violence
  HR = "HR",           // Harassment
  SH = "SH",           // Self-harm
  S3 = "S3",           // Sexual content involving minors
  H2 = "H2",           // Hate speech with threats
  V2 = "V2"            // Graphic violence
}

export enum ActionType {
  APPROVE = "APPROVE",
  WARNING = "WARNING",
  MUTE = "MUTE", 
  KICK = "KICK",
  BAN = "BAN",
  DELETE_MESSAGE = "DELETE_MESSAGE",
  ACCOUNT_RESTRICTION = "ACCOUNT_RESTRICTION"
}

export enum PriorityLevel {
  TOTAL = "TOTAL",
  CRITICAL = "CRITICAL",     // PII Risk detected
  HIGH = "HIGH",             // ContentType non-OK
  MODERATE = "MODERATE"      // Warning level
}

// Badge Variant Interface
export interface BadgeVariant {
  variant: "default" | "secondary" | "destructive" | "outline";
  className: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  dotColor: string;
  label: string;
  icon?: string; // Lucide icon name
}

// PII Risk Categories
export const PII_RISK_CATEGORIES = {
  CRITICAL: [
    PIIType.CREDITCARDNUMBER,
    PIIType.SOCIALNUM,
    PIIType.TAXNUM,
    PIIType.IDCARDNUM,
    PIIType.DRIVERLICENSENUM,
    PIIType.PASSWORD
  ],
  HIGH: [
    PIIType.DATEOFBIRTH,
    PIIType.ACCOUNTNUM
  ],
  MEDIUM: [
    PIIType.EMAIL,
    PIIType.TELEPHONENUM,
    PIIType.GIVENNAME,
    PIIType.SURNAME
  ],
  LOW: [
    PIIType.USERNAME,
    PIIType.CITY,
    PIIType.STREET,
    PIIType.BUILDINGNUM,
    PIIType.ZIPCODE
  ]
} as const;

// Comprehensive Moderation Color System
export const ModerationColorSystem = {
  // PII Types - Risk-based hierarchy
  pii: {
    // CRITICAL PII - Red variants (highest risk)
    [PIIType.CREDITCARDNUMBER]: {
      variant: "destructive" as const,
      className: "bg-red-600/15 dark:bg-red-600/25 hover:bg-red-600/20 text-red-700 dark:text-red-400 border-red-600/60 shadow-none rounded-full",
      bgColor: "hsl(0 84% 60% / 0.15)",
      textColor: "hsl(0 74% 42%)",
      borderColor: "hsl(0 84% 60% / 0.6)",
      dotColor: "hsl(0 84% 60%)",
      label: "Credit Card",
      icon: "CreditCard"
    },
    [PIIType.SOCIALNUM]: {
      variant: "destructive" as const,
      className: "bg-red-600/15 dark:bg-red-600/25 hover:bg-red-600/20 text-red-700 dark:text-red-400 border-red-600/60 shadow-none rounded-full",
      bgColor: "hsl(0 84% 60% / 0.15)",
      textColor: "hsl(0 74% 42%)",
      borderColor: "hsl(0 84% 60% / 0.6)",
      dotColor: "hsl(0 84% 60%)",
      label: "Social Security",
      icon: "ShieldAlert"
    },
    [PIIType.TAXNUM]: {
      variant: "destructive" as const,
      className: "bg-red-600/15 dark:bg-red-600/25 hover:bg-red-600/20 text-red-700 dark:text-red-400 border-red-600/60 shadow-none rounded-full",
      bgColor: "hsl(0 84% 60% / 0.15)",
      textColor: "hsl(0 74% 42%)",
      borderColor: "hsl(0 84% 60% / 0.6)",
      dotColor: "hsl(0 84% 60%)",
      label: "Tax Number",
      icon: "FileText"
    },
    [PIIType.IDCARDNUM]: {
      variant: "destructive" as const,
      className: "bg-red-600/15 dark:bg-red-600/25 hover:bg-red-600/20 text-red-700 dark:text-red-400 border-red-600/60 shadow-none rounded-full",
      bgColor: "hsl(0 84% 60% / 0.15)",
      textColor: "hsl(0 74% 42%)",
      borderColor: "hsl(0 84% 60% / 0.6)",
      dotColor: "hsl(0 84% 60%)",
      label: "ID Card",
      icon: "IdCard"
    },
    [PIIType.DRIVERLICENSENUM]: {
      variant: "destructive" as const,
      className: "bg-red-600/15 dark:bg-red-600/25 hover:bg-red-600/20 text-red-700 dark:text-red-400 border-red-600/60 shadow-none rounded-full",
      bgColor: "hsl(0 84% 60% / 0.15)",
      textColor: "hsl(0 74% 42%)",
      borderColor: "hsl(0 84% 60% / 0.6)",
      dotColor: "hsl(0 84% 60%)",
      label: "Driver License",
      icon: "Car"
    },
    [PIIType.PASSWORD]: {
      variant: "destructive" as const,
      className: "bg-red-600/15 dark:bg-red-600/25 hover:bg-red-600/20 text-red-700 dark:text-red-400 border-red-600/60 shadow-none rounded-full",
      bgColor: "hsl(0 84% 60% / 0.15)",
      textColor: "hsl(0 74% 42%)",
      borderColor: "hsl(0 84% 60% / 0.6)",
      dotColor: "hsl(0 84% 60%)",
      label: "Password",
      icon: "Lock"
    },

    // HIGH PII - Orange variants
    [PIIType.DATEOFBIRTH]: {
      variant: "outline" as const,
      className: "bg-orange-600/12 dark:bg-orange-600/20 hover:bg-orange-600/18 text-orange-700 dark:text-orange-400 border-orange-600/60 shadow-none rounded-full",
      bgColor: "hsl(25 95% 53% / 0.12)",
      textColor: "hsl(25 85% 45%)",
      borderColor: "hsl(25 95% 53% / 0.6)",
      dotColor: "hsl(25 95% 53%)",
      label: "Date of Birth",
      icon: "Calendar"
    },
    [PIIType.ACCOUNTNUM]: {
      variant: "outline" as const,
      className: "bg-orange-600/12 dark:bg-orange-600/20 hover:bg-orange-600/18 text-orange-700 dark:text-orange-400 border-orange-600/60 shadow-none rounded-full",
      bgColor: "hsl(25 95% 53% / 0.12)",
      textColor: "hsl(25 85% 45%)",
      borderColor: "hsl(25 95% 53% / 0.6)",
      dotColor: "hsl(25 95% 53%)",
      label: "Account Number",
      icon: "Hash"
    },

    // MEDIUM PII - Yellow/Amber variants
    [PIIType.EMAIL]: {
      variant: "outline" as const,
      className: "bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/15 text-amber-700 dark:text-amber-400 border-amber-600/60 shadow-none rounded-full",
      bgColor: "hsl(45 96% 53% / 0.1)",
      textColor: "hsl(45 86% 45%)",
      borderColor: "hsl(45 96% 53% / 0.6)",
      dotColor: "hsl(45 96% 53%)",
      label: "Email",
      icon: "Mail"
    },
    [PIIType.TELEPHONENUM]: {
      variant: "outline" as const,
      className: "bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/15 text-amber-700 dark:text-amber-400 border-amber-600/60 shadow-none rounded-full",
      bgColor: "hsl(45 96% 53% / 0.1)",
      textColor: "hsl(45 86% 45%)",
      borderColor: "hsl(45 96% 53% / 0.6)",
      dotColor: "hsl(45 96% 53%)",
      label: "Phone Number",
      icon: "Phone"
    },
    [PIIType.GIVENNAME]: {
      variant: "outline" as const,
      className: "bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/15 text-amber-700 dark:text-amber-400 border-amber-600/60 shadow-none rounded-full",
      bgColor: "hsl(45 96% 53% / 0.1)",
      textColor: "hsl(45 86% 45%)",
      borderColor: "hsl(45 96% 53% / 0.6)",
      dotColor: "hsl(45 96% 53%)",
      label: "First Name",
      icon: "User"
    },
    [PIIType.SURNAME]: {
      variant: "outline" as const,
      className: "bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/15 text-amber-700 dark:text-amber-400 border-amber-600/60 shadow-none rounded-full",
      bgColor: "hsl(45 96% 53% / 0.1)",
      textColor: "hsl(45 86% 45%)",
      borderColor: "hsl(45 96% 53% / 0.6)",
      dotColor: "hsl(45 96% 53%)",
      label: "Last Name",
      icon: "UserCheck"
    },

    // LOW PII - Blue/Purple variants
    [PIIType.USERNAME]: {
      variant: "secondary" as const,
      className: "bg-blue-600/10 dark:bg-blue-600/20 hover:bg-blue-600/15 text-blue-700 dark:text-blue-400 border-blue-600/60 shadow-none rounded-full",
      bgColor: "hsl(221 83% 53% / 0.1)",
      textColor: "hsl(221 73% 45%)",
      borderColor: "hsl(221 83% 53% / 0.6)",
      dotColor: "hsl(221 83% 53%)",
      label: "Username",
      icon: "AtSign"
    },
    [PIIType.CITY]: {
      variant: "secondary" as const,
      className: "bg-purple-600/10 dark:bg-purple-600/20 hover:bg-purple-600/15 text-purple-700 dark:text-purple-400 border-purple-600/60 shadow-none rounded-full",
      bgColor: "hsl(262 83% 58% / 0.1)",
      textColor: "hsl(262 73% 48%)",
      borderColor: "hsl(262 83% 58% / 0.6)",
      dotColor: "hsl(262 83% 58%)",
      label: "City",
      icon: "MapPin"
    },
    [PIIType.STREET]: {
      variant: "secondary" as const,
      className: "bg-purple-600/10 dark:bg-purple-600/20 hover:bg-purple-600/15 text-purple-700 dark:text-purple-400 border-purple-600/60 shadow-none rounded-full",
      bgColor: "hsl(262 83% 58% / 0.1)",
      textColor: "hsl(262 73% 48%)",
      borderColor: "hsl(262 83% 58% / 0.6)",
      dotColor: "hsl(262 83% 58%)",
      label: "Street Address",
      icon: "Navigation"
    },
    [PIIType.BUILDINGNUM]: {
      variant: "secondary" as const,
      className: "bg-blue-600/10 dark:bg-blue-600/20 hover:bg-blue-600/15 text-blue-700 dark:text-blue-400 border-blue-600/60 shadow-none rounded-full",
      bgColor: "hsl(221 83% 53% / 0.1)",
      textColor: "hsl(221 73% 45%)",
      borderColor: "hsl(221 83% 53% / 0.6)",
      dotColor: "hsl(221 83% 53%)",
      label: "Building Number",
      icon: "Building"
    },
    [PIIType.ZIPCODE]: {
      variant: "secondary" as const,
      className: "bg-blue-600/10 dark:bg-blue-600/20 hover:bg-blue-600/15 text-blue-700 dark:text-blue-400 border-blue-600/60 shadow-none rounded-full",
      bgColor: "hsl(221 83% 53% / 0.1)",
      textColor: "hsl(221 73% 45%)",
      borderColor: "hsl(221 83% 53% / 0.6)",
      dotColor: "hsl(221 83% 53%)",
      label: "ZIP Code",
      icon: "Hash"
    }
  },

  // Content Types - Severity-based hierarchy
  content: {
    [ContentType.OK]: {
      variant: "default" as const,
      className: "bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 border-emerald-600/60 shadow-none rounded-full",
      bgColor: "hsl(142 76% 36% / 0.1)",
      textColor: "hsl(142 66% 28%)",
      borderColor: "hsl(142 76% 36% / 0.6)",
      dotColor: "hsl(142 76% 36%)",
      label: "Safe Content",
      icon: "CheckCircle"
    },
    [ContentType.S]: {
      variant: "outline" as const,
      className: "bg-orange-600/12 dark:bg-orange-600/20 hover:bg-orange-600/18 text-orange-700 dark:text-orange-400 border-orange-600/60 shadow-none rounded-full",
      bgColor: "hsl(25 95% 53% / 0.12)",
      textColor: "hsl(25 85% 45%)",
      borderColor: "hsl(25 95% 53% / 0.6)",
      dotColor: "hsl(25 95% 53%)",
      label: "Sexual Content",
      icon: "AlertTriangle"
    },
    [ContentType.H]: {
      variant: "outline" as const,
      className: "bg-red-600/12 dark:bg-red-600/20 hover:bg-red-600/18 text-red-700 dark:text-red-400 border-red-600/60 shadow-none rounded-full",
      bgColor: "hsl(0 84% 60% / 0.12)",
      textColor: "hsl(0 74% 42%)",
      borderColor: "hsl(0 84% 60% / 0.6)",
      dotColor: "hsl(0 84% 60%)",
      label: "Hate Speech",
      icon: "MessageCircleX"
    },
    [ContentType.V]: {
      variant: "outline" as const,
      className: "bg-red-600/12 dark:bg-red-600/20 hover:bg-red-600/18 text-red-700 dark:text-red-400 border-red-600/60 shadow-none rounded-full",
      bgColor: "hsl(0 84% 60% / 0.12)",
      textColor: "hsl(0 74% 42%)",
      borderColor: "hsl(0 84% 60% / 0.6)",
      dotColor: "hsl(0 84% 60%)",
      label: "Violence",
      icon: "Zap"
    },
    [ContentType.HR]: {
      variant: "outline" as const,
      className: "bg-orange-600/12 dark:bg-orange-600/20 hover:bg-orange-600/18 text-orange-700 dark:text-orange-400 border-orange-600/60 shadow-none rounded-full",
      bgColor: "hsl(25 95% 53% / 0.12)",
      textColor: "hsl(25 85% 45%)",
      borderColor: "hsl(25 95% 53% / 0.6)",
      dotColor: "hsl(25 95% 53%)",
      label: "Harassment",
      icon: "UserX"
    },
    [ContentType.SH]: {
      variant: "outline" as const,
      className: "bg-red-600/12 dark:bg-red-600/20 hover:bg-red-600/18 text-red-700 dark:text-red-400 border-red-600/60 shadow-none rounded-full",
      bgColor: "hsl(0 84% 60% / 0.12)",
      textColor: "hsl(0 74% 42%)",
      borderColor: "hsl(0 84% 60% / 0.6)",
      dotColor: "hsl(0 84% 60%)",
      label: "Self Harm",
      icon: "Heart"
    },
    [ContentType.S3]: {
      variant: "destructive" as const,
      className: "bg-red-800/15 dark:bg-red-800/25 hover:bg-red-800/20 text-red-800 dark:text-red-300 border-red-800/70 shadow-none rounded-full",
      bgColor: "hsl(0 70% 35% / 0.15)",
      textColor: "hsl(0 60% 25%)",
      borderColor: "hsl(0 70% 35% / 0.7)",
      dotColor: "hsl(0 70% 35%)",
      label: "CSAM Content",
      icon: "ShieldX"
    },
    [ContentType.H2]: {
      variant: "destructive" as const,
      className: "bg-red-800/15 dark:bg-red-800/25 hover:bg-red-800/20 text-red-800 dark:text-red-300 border-red-800/70 shadow-none rounded-full",
      bgColor: "hsl(0 70% 35% / 0.15)",
      textColor: "hsl(0 60% 25%)",
      borderColor: "hsl(0 70% 35% / 0.7)",
      dotColor: "hsl(0 70% 35%)",
      label: "Hate + Threats",
      icon: "Skull"
    },
    [ContentType.V2]: {
      variant: "destructive" as const,
      className: "bg-red-800/15 dark:bg-red-800/25 hover:bg-red-800/20 text-red-800 dark:text-red-300 border-red-800/70 shadow-none rounded-full",
      bgColor: "hsl(0 70% 35% / 0.15)",
      textColor: "hsl(0 60% 25%)",
      borderColor: "hsl(0 70% 35% / 0.7)",
      dotColor: "hsl(0 70% 35%)",
      label: "Graphic Violence",
      icon: "Swords"
    }
  },

  // Action Types - Impact severity hierarchy
  actions: {
    [ActionType.APPROVE]: {
      variant: "default" as const,
      className: "bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 border-emerald-600/60 shadow-none rounded-full",
      bgColor: "hsl(142 76% 36% / 0.1)",
      textColor: "hsl(142 66% 28%)",
      borderColor: "hsl(142 76% 36% / 0.6)",
      dotColor: "hsl(142 76% 36%)",
      label: "Approved",
      icon: "Check"
    },
    [ActionType.WARNING]: {
      variant: "outline" as const,
      className: "bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/15 text-amber-700 dark:text-amber-400 border-amber-600/60 shadow-none rounded-full",
      bgColor: "hsl(45 96% 53% / 0.1)",
      textColor: "hsl(45 86% 45%)",
      borderColor: "hsl(45 96% 53% / 0.6)",
      dotColor: "hsl(45 96% 53%)",
      label: "Warning",
      icon: "AlertTriangle"
    },
    [ActionType.MUTE]: {
      variant: "outline" as const,
      className: "bg-orange-600/12 dark:bg-orange-600/20 hover:bg-orange-600/18 text-orange-700 dark:text-orange-400 border-orange-600/60 shadow-none rounded-full",
      bgColor: "hsl(25 95% 53% / 0.12)",
      textColor: "hsl(25 85% 45%)",
      borderColor: "hsl(25 95% 53% / 0.6)",
      dotColor: "hsl(25 95% 53%)",
      label: "Muted",
      icon: "MicOff"
    },
    [ActionType.DELETE_MESSAGE]: {
      variant: "outline" as const,
      className: "bg-orange-600/12 dark:bg-orange-600/20 hover:bg-orange-600/18 text-orange-700 dark:text-orange-400 border-orange-600/60 shadow-none rounded-full",
      bgColor: "hsl(25 95% 53% / 0.12)",
      textColor: "hsl(25 85% 45%)",
      borderColor: "hsl(25 95% 53% / 0.6)",
      dotColor: "hsl(25 95% 53%)",
      label: "Message Deleted",
      icon: "Trash2"
    },
    [ActionType.KICK]: {
      variant: "destructive" as const,
      className: "bg-red-600/15 dark:bg-red-600/25 hover:bg-red-600/20 text-red-700 dark:text-red-400 border-red-600/60 shadow-none rounded-full",
      bgColor: "hsl(0 84% 60% / 0.15)",
      textColor: "hsl(0 74% 42%)",
      borderColor: "hsl(0 84% 60% / 0.6)",
      dotColor: "hsl(0 84% 60%)",
      label: "Kicked",
      icon: "UserMinus"
    },
    [ActionType.ACCOUNT_RESTRICTION]: {
      variant: "destructive" as const,
      className: "bg-red-600/15 dark:bg-red-600/25 hover:bg-red-600/20 text-red-700 dark:text-red-400 border-red-600/60 shadow-none rounded-full",
      bgColor: "hsl(0 84% 60% / 0.15)",
      textColor: "hsl(0 74% 42%)",
      borderColor: "hsl(0 84% 60% / 0.6)",
      dotColor: "hsl(0 84% 60%)",
      label: "Account Restricted",
      icon: "Lock"
    },
    [ActionType.BAN]: {
      variant: "destructive" as const,
      className: "bg-red-800/15 dark:bg-red-800/25 hover:bg-red-800/20 text-red-800 dark:text-red-300 border-red-800/70 shadow-none rounded-full",
      bgColor: "hsl(0 70% 35% / 0.15)",
      textColor: "hsl(0 60% 25%)",
      borderColor: "hsl(0 70% 35% / 0.7)",
      dotColor: "hsl(0 70% 35%)",
      label: "Banned",
      icon: "Ban"
    }
  },

  // Priority Levels
  priority: {
    [PriorityLevel.TOTAL]: {
      variant: "secondary" as const,
      className: "bg-muted/60 hover:bg-muted/80 text-muted-foreground border-muted shadow-none rounded-full",
      bgColor: "hsl(var(--muted) / 0.6)",
      textColor: "hsl(var(--muted-foreground))",
      borderColor: "hsl(var(--muted))",
      dotColor: "hsl(var(--muted-foreground))",
      label: "Total",
      icon: "BarChart3"
    },
    [PriorityLevel.MODERATE]: {
      variant: "outline" as const,
      className: "bg-blue-600/10 dark:bg-blue-600/20 hover:bg-blue-600/15 text-blue-700 dark:text-blue-400 border-blue-600/60 shadow-none rounded-full",
      bgColor: "hsl(221 83% 53% / 0.1)",
      textColor: "hsl(221 73% 45%)",
      borderColor: "hsl(221 83% 53% / 0.6)",
      dotColor: "hsl(221 83% 53%)",
      label: "Moderate",
      icon: "Info"
    },
    [PriorityLevel.HIGH]: {
      variant: "outline" as const,
      className: "bg-orange-600/12 dark:bg-orange-600/20 hover:bg-orange-600/18 text-orange-700 dark:text-orange-400 border-orange-600/60 shadow-none rounded-full",
      bgColor: "hsl(25 95% 53% / 0.12)",
      textColor: "hsl(25 85% 45%)",
      borderColor: "hsl(25 95% 53% / 0.6)",
      dotColor: "hsl(25 95% 53%)",
      label: "High Priority",
      icon: "AlertCircle"
    },
    [PriorityLevel.CRITICAL]: {
      variant: "destructive" as const,
      className: "bg-red-600/15 dark:bg-red-600/25 hover:bg-red-600/20 text-red-700 dark:text-red-400 border-red-600/60 shadow-none rounded-full",
      bgColor: "hsl(0 84% 60% / 0.15)",
      textColor: "hsl(0 74% 42%)",
      borderColor: "hsl(0 84% 60% / 0.6)",
      dotColor: "hsl(0 84% 60%)",
      label: "Critical",
      icon: "AlertOctagon"
    }
  }
} as const;

// Utility functions for getting badge variants
export const getPIIBadgeVariant = (piiType: PIIType): BadgeVariant => {
  return ModerationColorSystem.pii[piiType];
};

export const getContentBadgeVariant = (contentType: ContentType): BadgeVariant => {
  return ModerationColorSystem.content[contentType];
};

export const getActionBadgeVariant = (actionType: ActionType): BadgeVariant => {
  return ModerationColorSystem.actions[actionType];
};

export const getPriorityBadgeVariant = (priority: PriorityLevel): BadgeVariant => {
  return ModerationColorSystem.priority[priority];
};

// Risk assessment utility
export const getPIIRiskLevel = (piiType: PIIType): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' => {
  if ((PII_RISK_CATEGORIES.CRITICAL as readonly PIIType[]).includes(piiType)) return 'CRITICAL';
  if ((PII_RISK_CATEGORIES.HIGH as readonly PIIType[]).includes(piiType)) return 'HIGH';
  if ((PII_RISK_CATEGORIES.MEDIUM as readonly PIIType[]).includes(piiType)) return 'MEDIUM';
  return 'LOW';
};

export type ModerationColorSystemType = typeof ModerationColorSystem;