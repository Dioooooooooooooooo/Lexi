export declare class ClassroomDto {
    classroom_id: string;
}
export declare class PupilClassroomDto extends ClassroomDto {
    pupil_id: string;
}
export declare class BatchPupilClassroomDto extends ClassroomDto {
    pupil_ids: string[];
}
export declare class EnrollPupilDto extends BatchPupilClassroomDto {
}
export declare class UnEnrollPupilDto extends BatchPupilClassroomDto {
}
