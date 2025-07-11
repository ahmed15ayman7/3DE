import { toast } from 'react-toastify';

export const showToast = {
    loading: (message: string) => toast.loading(message),
    
    success: (message: string, toastId?: string | number) => {
        if (toastId) {
            toast.update(toastId, { 
                render: message, 
                type: 'success', 
                autoClose: 3000, 
                isLoading: false 
            });
        } else {
            toast.success(message, { autoClose: 3000 });
        }
    },
    
    error: (message: string, toastId?: string | number) => {
        if (toastId) {
            toast.update(toastId, { 
                render: message, 
                type: 'error', 
                autoClose: 3000, 
                isLoading: false 
            });
        } else {
            toast.error(message, { autoClose: 3000 });
        }
    }
};

export const getRoleRedirectPath = (role: string): string => {
    const rolePaths: Record<string, string> = {
        'STUDENT': '/student/dashboard',
        'INSTRUCTOR': '/instructor/dashboard',
        'ACADEMY': '/academy/dashboard',
        'ADMIN': '/admin/dashboard',
        'PARENT': '/parent/dashboard'
    };
    
    return rolePaths[role] || '/auth/signin';
};

export const getRoleSuccessMessage = (role: string): string => {
    const roleMessages: Record<string, string> = {
        'STUDENT': 'تم تسجيل الدخول للطالب بنجاح',
        'INSTRUCTOR': 'تم تسجيل الدخول للمحاضر بنجاح',
        'ACADEMY': 'تم تسجيل الدخول للجامعة بنجاح',
        'ADMIN': 'تم تسجيل الدخول للمدير بنجاح',
        'PARENT': 'تم تسجيل الدخول للولي بنجاح'
    };
    
    return roleMessages[role] || 'تم تسجيل الدخول بنجاح';
}; 