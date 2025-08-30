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
  Genres,
  Achievements,
  Activities,
  PupilAchievements,
} from '../db.d';

  ActivityLogs,
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
export type NewReadingSession = Insertable<ReadingSessions>;
export type PupilAchievement = Selectable<PupilAchievements>;
export type NewPupilAchievement = Insertable<PupilAchievements>;
