import { Insertable, Selectable } from 'kysely';
import {
  Pupils,
  Teachers,
  PupilLeaderboard as PLTable,
  Classrooms,
  ReadingMaterials,
  ReadingSessions,
  Minigames,
  MinigameLogs,
  ClassroomEnrollment,
} from "../db.d";

export enum MinigameType {
  SentenceRearrangement,
  Choices,
  WordsFromLetters,
}

export type Pupil = Selectable<Pupils>;
export type Teacher = Selectable<Teachers>;
export type PupilLeaderboard = Selectable<PLTable>;
export type Classroom = Selectable<Classrooms>;
export type ReadingMaterial = Selectable<ReadingMaterials>;
export type ReadingSession = Selectable<ReadingSessions>;
export type Minigame = Selectable<Minigames>;
export type MinigameLog = Selectable<MinigameLogs>;
export type Genre = Selectable<Genres>;
export type Achievement = Selectable<Achievements>;
export type Activity = Selectable<Activities>;
export type ActivityLog = Selectable<ActivityLogs>;

export type NewActivityLog = Insertable<ActivityLogs>;
export type NewActivity = Insertable<Activities>;
export type NewAchievement = Insertable<Achievements>;
export type NewClassroom = Insertable<Classrooms>;
export type NewClassroomEnrollment = Insertable<ClassroomEnrollment>;
export type NewReadingSession = Insertable<ReadingSessions>;
export type NewClassroomEnrollment = Insertable<ClassroomEnrollment>;
