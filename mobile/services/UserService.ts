import { axiosInstance } from '@/utils/axiosInstance';

import { API_URL } from '../utils/constants';
import {
  dataTagErrorSymbol,
  useMutation,
  useQueries,
} from '@tanstack/react-query';
import {
  setupAuthToken,
  useAuthMe,
  useChangePassword,
  useUpdateProfile,
} from '@/hooks';
import { LoginStreak } from '@/models/LoginStreak';
import { Achievement } from '@/models/Achievement';

export const useHandleUpdateProfile = () => {
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const { refetch: getUser } = useAuthMe();

  return async (updateProfileForm: Record<string, any>) => {
    // Field mapping for frontend to backend compatibility
    const fieldMap: Record<string, string> = {
      firstName: 'first_name',
      lastName: 'last_name',
      userName: 'username',
    };

    // Transform field names
    const transformedForm = Object.keys(updateProfileForm).reduce(
      (acc, key) => {
        const backendKey = fieldMap[key] || key;
        acc[backendKey] = updateProfileForm[key];
        return acc;
      },
      {} as Record<string, any>,
    );

    // Determine which endpoint to use based on the fields being updated
    const pupilFields = ['age', 'grade_level', 'level'];
    const authFields = [
      'first_name',
      'last_name',
      'username',
      'email',
      'avatar',
      'phone',
    ];
    const passwordFields = [
      'currentPassword',
      'password',
      'confirmPassword',
      'current_password',
      'new_password',
    ];

    const hasPupilFields = Object.keys(transformedForm).some(key =>
      pupilFields.includes(key),
    );
    const hasAuthFields = Object.keys(transformedForm).some(key =>
      authFields.includes(key),
    );
    const hasPasswordFields = Object.keys(updateProfileForm).some(key =>
      passwordFields.includes(key),
    );

    try {
      if (hasPasswordFields) {
        // Use the auth change-password endpoint for password changes
        const passwordData = {
          current_password:
            updateProfileForm.currentPassword ||
            updateProfileForm.current_password,
          new_password:
            updateProfileForm.password || updateProfileForm.new_password,
        };
        const res = await changePasswordMutation.mutateAsync(passwordData);
        console.log('Password change response:', res);
      } else if (hasPupilFields || hasAuthFields) {
        const res = await updateProfileMutation.mutateAsync(transformedForm);
        console.log('Profile update response:', res);
      } else {
        console.warn('No valid fields to update.');
      }
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to update profile',
      );
    }

    const updatedUser = await getUser();
    console.log('Updated user: ', updatedUser);
    return updatedUser.data;
  };
};

export const checkUserExist = async (fieldType: string, fieldValue: string) => {
  console.log(
    '🔍 Check User Exist - fieldType:',
    fieldType,
    'fieldValue:',
    fieldValue,
  );

  try {
    // Use hey-api client directly for check-user endpoint
    const { client } = await import('../hooks/api/requests/client.gen');

    const response = await client.get({
      url: `/auth/check-user?fieldType=${fieldType}&fieldValue=${fieldValue}`,
    });

    console.log('✅ Check User Exist - Response:', response);

    if (response.status === 429) {
      throw Error('Slow down!');
    }

    return response.data;
  } catch (error: any) {
    console.error('❌ Check User Exist - Error:', error);

    // If it's a 409 (user exists), that's expected, not an error for our purposes
    if (error.status === 409) {
      return error.body || { statusCode: 409 };
    }

    throw error;
  }
};

export const uploadAvatar = async (avatar: {
  uri: string;
  type: string;
  name: string;
}): Promise<string> => {
  const formData = new FormData();
  formData.append('avatar', {
    uri: avatar.uri,
    type: avatar.type,
    name: avatar.name,
  } as any);

  const response = await axiosInstance.post(
    `http://${process.env.EXPO_PUBLIC_IPADDRESS}:3000/upload/image`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      validateStatus: () => true,
    },
  );
  console.log('Response: ', response);

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(response.data.message);
  }

  console.log('Upload response data:', response.data);

  return response.data.data;
};

export const useUploadAvatar = () => {
  return useMutation({
    mutationFn: async (avatar: { uri: string; type: string; name: string }) => {
      return uploadAvatar(avatar);
    },
    onSuccess: data => {
      console.log('Upload successfuljjj: ', data);
    },
    onError: error => {
      console.error('Error uploading avatar:', error);
    },
  });
};

export const createSession = async () => {
  const response = await axiosInstance.post(`${API_URL}/pupils/me/sessions`, {
    validateStatus: () => true,
  });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}; // 1 session 1 new row

export const endSession = async (sessionId: string) => {
  const response = await axiosInstance.put(
    `${API_URL}/pupils/me/sessions/${sessionId}`,
    {
      validateStatus: () => true,
    },
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(response.data.message);
  }

  return response.data.data;
};

export const getSessionById = async () => {};

export const recordLoginStreak = async () => {
  const response = await axiosInstance.put(`${API_URL}/pupils/me/streak`, {
    validateStatus: () => true,
  });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(response.data.message);
  }

  return response.data.data;
};

export const getTotalSessions = () => UserService.getUserMeSessions();
export const getReadingSessions = () =>
  ReadingSessionsService.getReadingSessions();
export const getLoginStreak = () => UserService.getUserMeStreak();
export const getPupilAchievements = () => AchievementsService.getAchievements();

export const useProfileStats = (isPupil: boolean) => {
  const queries = useQueries({
    queries: [
      {
        queryKey: ['achievements'],
        queryFn: async () => {
          console.log('Fetching achievements...');
          const res = await getPupilAchievements();
          console.log('Achievements:', res);
          return res;
        },
        select: (data: any) => data.data as Achievement[],
        enabled: !!isPupil,
      },
      {
        queryKey: ['totalSession'],
        queryFn: async () => {
          console.log('Fetching total sessions...');
          const res = await getTotalSessions();
          console.log('Total Sessions:', res);
          return res;
        },
        refetchOnWindowFocus: true,
        select: (data: any) => data.data.number as number,
        enabled: !!isPupil,
      },
      {
        queryKey: ['loginStreak'],
        queryFn: async () => {
          console.log('Fetching login streak...');
          const res = await getLoginStreak();
          console.log('Login Streak:', res);
          return res;
        },
        select: (data: any) => data.data as LoginStreak,
        enabled: !!isPupil,
      },
      {
        queryKey: ['readingSessions'],
        queryFn: async () => {
          console.log('Fetching reading sessions...');
          const res = await getReadingSessions();
          console.log('Reading Sessions:', res);
          return res;
        },
        select: (data: any) => data.data.length,
        enabled: !!isPupil,
      },
    ],
  });

  return queries;
};
