import { Injectable, Inject } from "@nestjs/common";
import { CreateClassroomDto } from "./dto/create-classroom.dto";
import { UpdateClassroomDto } from "./dto/update-classroom.dto";
import { Kysely } from "kysely";
import { DB } from "@/database/db";

@Injectable()
export class ClassroomsService {
  constructor(@Inject("DATABASE") private readonly db: Kysely<DB>) {}

  async create(user: any, createClassroomDto: CreateClassroomDto) {
    const classroom = await this.db
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
