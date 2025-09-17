export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
  username: string;
  twoFactorEnabled: boolean;
  phone: string;
  role: string;

  pupil?: Pupil;
}

export interface TeacherProfile {
  user: User;
}

export interface Pupil {
  id?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  level?: number;
}

export interface PupilInClassroom {
  id: string;
  classroomId: string;
  firstName: string;
  lastName: string;
  level: number;
  pupilId: string;
}

export function extractUser(data: Record<string, any>): User {
  const {
    id,
    email,
    first_name,
    last_name,
    avatar,
    username,
    twoFactorEnabled,
    phone,
    role,
    pupil,
  } = data;

  const user: User = {
    id: id,
    email: email,
    first_name: first_name,
    last_name: last_name,
    avatar: avatar,
    username: username,
    twoFactorEnabled: twoFactorEnabled,
    phone: phone,
    role: role,
  };

  if (role === 'Pupil') {
    user.pupil = pupil;
  }
  return user;
}
