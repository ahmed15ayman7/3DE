import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Path, Course, User } from '@3de/interfaces';
import { pathApi } from '@3de/apis';

interface PathWithRelations extends Path {
  courses: Course[];
  peers: User[];
}

export const usePaths = () => {
  const queryClient = useQueryClient();

  // جلب جميع مسارات التعلم
  const useAllPaths = (search: string, page: number, limit: number) => {
    return useQuery({
      queryKey: ['paths'],
      queryFn: async () => {
        // محاكاة API call
        const paths = await pathApi.getAll(page, limit, search);
        return paths.data as PathWithRelations[];
      }
    });
  };

  // جلب مسار واحد بالتفاصيل
  const usePath = (pathId: string) => {
    return useQuery({
      queryKey: ['path', pathId],
      queryFn: async () => {
        // محاكاة API call
        const path = await pathApi.getById(pathId);
        return path.data as PathWithRelations;
      },
      enabled: !!pathId
    });
  };

  // الاشتراك في مسار
  const useSubscribeToPath = () => {
    return useMutation({
      mutationFn: async (pathId: string) => {
        // محاكاة API call
        console.log('Subscribing to path:', pathId);
        return { success: true };
      },
      onSuccess: () => {
        // تحديث cache
        queryClient.invalidateQueries({ queryKey: ['paths'] });
      }
    });
  };

  // إلغاء الاشتراك من مسار
  const useUnsubscribeFromPath = () => {
    return useMutation({
      mutationFn: async (pathId: string) => {
        // محاكاة API call
        console.log('Unsubscribing from path:', pathId);
        return { success: true };
      },
      onSuccess: () => {
        // تحديث cache
        queryClient.invalidateQueries({ queryKey: ['paths'] });
      }
    });
  };

  return {
    useAllPaths,
    usePath,
    useSubscribeToPath,
    useUnsubscribeFromPath
  };
}; 