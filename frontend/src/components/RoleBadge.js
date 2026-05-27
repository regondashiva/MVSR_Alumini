import React from 'react';
import { 
  AcademicCapIcon, 
  BriefcaseIcon, 
  UserGroupIcon 
} from '@heroicons/react/outline';

const RoleBadge = ({ role, size = 'md', variant = 'badge' }) => {
  const getRoleConfig = () => {
    switch(role?.toLowerCase()) {
      case 'faculty':
        return {
          label: 'Faculty Alumni',
          icon: BriefcaseIcon,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-300',
          darkBgColor: 'dark:bg-blue-900',
          darkTextColor: 'dark:text-blue-200'
        };
      case 'student':
        return {
          label: 'Student Alumni',
          icon: AcademicCapIcon,
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800',
          borderColor: 'border-purple-300',
          darkBgColor: 'dark:bg-purple-900',
          darkTextColor: 'dark:text-purple-200'
        };
      default:
        return {
          label: 'Alumni',
          icon: UserGroupIcon,
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-300',
          darkBgColor: 'dark:bg-green-900',
          darkTextColor: 'dark:text-green-200'
        };
    }
  };

  const config = getRoleConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  if (variant === 'icon') {
    return (
      <div 
        className={`flex items-center justify-center rounded-full ${config.bgColor} ${config.textColor} ${sizeClasses[size]}`}
        title={config.label}
      >
        <Icon className={iconSizeClasses[size]} />
      </div>
    );
  }

  return (
    <div 
      className={`
        inline-flex items-center gap-1.5 
        ${sizeClasses[size]} 
        rounded-full border 
        ${config.bgColor} 
        ${config.textColor}
        ${config.borderColor}
        ${config.darkBgColor}
        ${config.darkTextColor}
        font-medium whitespace-nowrap
      `}
    >
      <Icon className={iconSizeClasses[size]} />
      <span>{config.label}</span>
    </div>
  );
};

export default RoleBadge;
