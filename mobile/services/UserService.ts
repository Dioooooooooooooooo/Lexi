import { axiosInstance } from "@/utils/axiosInstance";

import { API_URL } from "../utils/constants";
import { useQueries } from "@tanstack/react-query";
import { makeMultipartFormDataRequest } from "@/utils/utils";
import { getAllReadingSessions } from "./ReadingSessionService";
import { ReadingContentType } from "@/models/ReadingContent";

export const getProfile = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/auth/me`);

    return response.data;
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch profile"
    );
  }
};

export const updateProfile = async (updateProfileForm: Record<string, any>) => {
  try {
    // Field mapping for frontend to backend compatibility
    const fieldMap: Record<string, string> = {
      firstName: 'first_name',
      lastName: 'last_name', 
      userName: 'username'
    };

    // Transform field names
    const transformedForm = Object.keys(updateProfileForm).reduce((acc, key) => {
      const backendKey = fieldMap[key] || key;
      acc[backendKey] = updateProfileForm[key];
      return acc;
    }, {} as Record<string, any>);

    // Determine which endpoint to use based on the fields being updated
    const pupilFields = ['age', 'grade_level', 'level'];
    const authFields = ['first_name', 'last_name', 'username', 'email', 'avatar', 'phone'];
    const passwordFields = ['currentPassword', 'password', 'confirmPassword', 'current_password', 'new_password'];

    const hasPupilFields = Object.keys(transformedForm).some(key => pupilFields.includes(key));
    const hasAuthFields = Object.keys(transformedForm).some(key => authFields.includes(key));
    const hasPasswordFields = Object.keys(updateProfileForm).some(key => passwordFields.includes(key));

    let response;
    
    if (hasPasswordFields) {
      // Use the auth change-password endpoint for password changes
      const passwordData = {
        current_password: updateProfileForm.currentPassword || updateProfileForm.current_password,
        new_password: updateProfileForm.password || updateProfileForm.new_password
      };
      response = await axiosInstance.post(`${API_URL}/auth/change-password`, passwordData);
    } else if (hasPupilFields) {
      // Use pupils endpoint for pupil-specific data
      response = await axiosInstance.patch(`${API_URL}/pupils/me`, transformedForm);
    } else if (hasAuthFields) {
      // Use auth endpoint for user profile data
      response = await axiosInstance.patch(`${API_URL}/auth/me`, transformedForm);
    } else {
      // Default to auth endpoint
      response = await axiosInstance.patch(`${API_URL}/auth/me`, transformedForm);
    }
    
    return response.data;
  } catch (error: any) {
    console.error("Error updating profile:", error);
    throw new Error(
      error?.response?.data?.message || error?.message || "Failed to update profile"
    );
  }
};

export const checkUserExist = async (fieldType: string, fieldValue: string) => {
  const response = await axiosInstance.get(
    `/auth/check-user?fieldType=${fieldType}&fieldValue=${fieldValue}`,
    {
      validateStatus: () => true,
    }
  );

  if (response.status === 429) {
    throw Error("Slow down!");
  }

  return response.data;
};

export const deleteAccount = async () => {
  const response = await axiosInstance.delete(`${API_URL}/auth/me`);

  if (response.status !== 200 && response.status !== 204) {
    throw new Error(response.data.message);
  }

  return response.data;
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
  const response = await axiosInstance.put(`${API_URL}/pupils/me/sessions/${sessionId}`, {
    validateStatus: () => true,
  });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(response.data.message);
  }

  return response.data.data;
};

export const getTotalSession = async () => {
  // TODO: Implement sessions endpoint in NestJS backend
  // Temporary fallback to prevent profile page crash
  return 0;
};;

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

export const getLoginStreak = async () => {
  // TODO: Implement login streak endpoint in NestJS backend
  // Temporary fallback to prevent profile page crash
  return {
    longestStreak: 0,
    currentStreak: 0
  };
};;

export const getPupilAchievements = async () => {
  // TODO: Implement achievements endpoint in NestJS backend
  // Temporary fallback to prevent profile page crash
  return [];
};;

export const useProfileStats = (isPupil: boolean) => {
  return useQueries({
    queries: [
      {
        queryKey: ["achievements"],
        queryFn: getPupilAchievements,
        enabled: isPupil,
      },
      {
        queryKey: ["totalSession"],
        queryFn: getTotalSession,
        refetchOnWindowFocus: true,
        enabled: isPupil,
      },
      {
        queryKey: ["loginStreak"],
        queryFn: getLoginStreak,
        enabled: isPupil,
      },
      {
        queryKey: ["readingSessions"],
        queryFn: getAllReadingSessions,
        select: (data: any) => data.length,
        enabled: isPupil,
      },
    ],
  });
};
