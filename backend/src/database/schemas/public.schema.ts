import { Generated } from "kysely";

export interface PupilsTable {
  id: Generated<string>;
  user_id: Generated<string>;
  age: number | null;
  grade_level: number | null;
  level: number | 0;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface TeachersTable {
  id: Generated<string>;
  user_id: Generated<string>;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface PupilLeaderBoardTable {
  id: Generated<string>;
  pupil_id: Generated<string>;
  level: number;
  recorded_at: Generated<Date>;
}

export interface ClassroomsTable {
  id: Generated<string>;
  name: string;
  description: string | null;
  teacher_id: Generated<string>;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface ReadingMaterialsTable {
  id: Generated<string>;
  author: string;
  title: string;
  description: string;
  grade_level: number;
  difficulty: number;
  coverr: string;
  content: string;
  is_deped: boolean;
  created_at: Generated<Date>;
}

export interface ReadingSessionsTable {
  id: Generated<string>;
  pupil_id: Generated<string>;
  reading_material_id: Generated<string>;
  completion_percentage: number;
  started_at: Generated<Date>;
  completed_at: Generated<Date> | null;
}

export enum MinigameType {
  SentenceRearrangement,
  Choices,
  WordsFromLetters,
}

export interface MinigamesTable {
  id: Generated<string>;
  minigame_type: MinigameType;
  reading_material_id: Generated<string>;
  part_num: number;
  meta_data: string | null;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
  max_score: number | 0;
}

export interface MinigameLogsTable {
  id: Generated<string>;
  pupil_id: Generated<string>;
  reading_session_id: Generated<string>;
  minigame_id: Generated<string>;
  result: string; // JSON string of the result
  created_at: Generated<Date>;
}
