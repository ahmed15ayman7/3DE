// Common types for components

export interface BaseComponentProps {
    className?: string;
    animate?: boolean;
}

export interface StatItem {
    label: string;
    value: number | string;
    icon?: React.ReactNode;
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export interface ActionButton {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: 'contained' | 'outlined' | 'text';
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

export interface FeatureItem {
    icon: React.ReactNode;
    title: string;
    description: string;
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

export interface CardItem {
    id: string;
    title: string;
    description?: string;
    image?: string;
    icon?: React.ReactNode;
    tags?: string[];
    rating?: number;
    isBookmarked?: boolean;
    isFeatured?: boolean;
    stats?: {
        [key: string]: number | string;
    };
    metadata?: {
        [key: string]: any;
    };
}

export interface AnimationVariants {
    hidden: {
        opacity: number;
        y?: number;
        x?: number;
        scale?: number;
        rotate?: number;
    };
    visible: {
        opacity: number;
        y?: number;
        x?: number;
        scale?: number;
        rotate?: number;
        transition: {
            duration: number;
            ease?: string;
            delay?: number;
            staggerChildren?: number;
        };
    };
    hover?: {
        y?: number;
        x?: number;
        scale?: number;
        rotate?: number;
        transition: {
            duration: number;
            ease?: string;
        };
    };
    exit?: {
        opacity: number;
        y?: number;
        x?: number;
        scale?: number;
        transition: {
            duration: number;
            ease?: string;
        };
    };
}

export interface ColorScheme {
    primary: string;
    secondary: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    background: string;
    surface: string;
    text: {
        primary: string;
        secondary: string;
        disabled: string;
    };
}

export interface ResponsiveBreakpoints {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
}

export interface LoadingState {
    isLoading: boolean;
    error?: string | null;
    retry?: () => void;
}

export interface PaginationState {
    page: number;
    pageSize: number;
    total: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface FilterState {
    search: string;
    filters: {
        [key: string]: any;
    };
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export interface ModalState {
    isOpen: boolean;
    title?: string;
    content?: React.ReactNode;
    actions?: ActionButton[];
    size?: 'small' | 'medium' | 'large' | 'full';
    onClose?: () => void;
}

export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date' | 'file';
    placeholder?: string;
    required?: boolean;
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        message?: string;
    };
    options?: Array<{
        value: string | number;
        label: string;
    }>;
}

export interface TableColumn {
    key: string;
    label: string;
    sortable?: boolean;
    filterable?: boolean;
    width?: number | string;
    align?: 'left' | 'center' | 'right';
    render?: (value: any, row: any) => React.ReactNode;
}

export interface TableState {
    data: any[];
    columns: TableColumn[];
    loading: boolean;
    pagination: PaginationState;
    filters: FilterState;
    selectedRows: string[];
}

export interface ChartData {
    labels: string[];
    datasets: Array<{
        label: string;
        data: number[];
        backgroundColor?: string | string[];
        borderColor?: string | string[];
        borderWidth?: number;
    }>;
}

export interface MapLocation {
    lat: number;
    lng: number;
    title?: string;
    description?: string;
    icon?: string;
}

export interface FileUpload {
    file: File;
    progress: number;
    status: 'uploading' | 'completed' | 'error';
    url?: string;
    error?: string;
}

export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    color?: string;
    location?: string;
    attendees?: string[];
}

export interface ChatMessage {
    id: string;
    content: string;
    sender: {
        id: string;
        name: string;
        avatar?: string;
    };
    timestamp: Date;
    type: 'text' | 'image' | 'file' | 'audio' | 'video';
    status: 'sent' | 'delivered' | 'read';
    replyTo?: string;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    status: 'online' | 'offline' | 'away' | 'busy';
    lastSeen?: Date;
    bio?: string;
    preferences?: {
        [key: string]: any;
    };
} 