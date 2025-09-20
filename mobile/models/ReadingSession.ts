export interface ReadingSession {
  id: string;
  pupil_id: string;
  reading_material_id: string;
  completion_percentage: number;
  started_at: string;
  completed_at: string;
}
