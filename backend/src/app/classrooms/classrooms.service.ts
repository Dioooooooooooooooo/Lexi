import { Injectable } from "@nestjs/common";
import { CreateClassroomDto } from "./dto/create-classroom.dto";
import { UpdateClassroomDto } from "./dto/update-classroom.dto";
import { KyselyDatabaseService } from "@/database/kysely-database.service";

@Injectable()
export class ClassroomsService {
  constructor(private dbService: KyselyDatabaseService) {}

  async create(user: any, createClassroomDto: CreateClassroomDto) {
    const db = this.dbService.database;

    const classroom = await db
      .insertInto("public.classrooms")
      .values({ ...createClassroomDto, teacher_id: user.teacher.id })
      .returningAll()
      .execute();

    return { message: "Classroom created successfully", data: classroom };
  }

  findAll() {
    return `This action returns all classrooms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} classroom`;
  }

  update(id: number, updateClassroomDto: UpdateClassroomDto) {
    return `This action updates a #${id} classroom`;
  }

  remove(id: number) {
    return `This action removes a #${id} classroom`;
  }
}
