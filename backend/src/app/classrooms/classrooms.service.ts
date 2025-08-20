import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateClassroomDto } from "./dto/create-classroom.dto";
import { UpdateClassroomDto } from "./dto/update-classroom.dto";
import { Classroom } from "@/database/schemas";
import { Kysely } from "kysely";
import { DB } from "@/database/db";

@Injectable()
export class ClassroomsService {
  constructor(@Inject("DATABASE") private readonly db: Kysely<DB>) {}

  async create(
    user: any,
    createClassroomDto: CreateClassroomDto,
  ): Promise<Classroom> {
    const join_code = await this.generateUniqueRoomCode();

    const classroom = await this.db
      .insertInto("public.classrooms")
      .values({ ...createClassroomDto, teacher_id: user.teacher.id, join_code })
      .returningAll()
      .executeTakeFirst();

    return classroom;
  }

  async findAll(): Promise<Classroom[]> {
    return await this.db.selectFrom("public.classrooms").selectAll().execute();
  }

  async findOne(id: string): Promise<Classroom> {
    return await this.db
      .selectFrom("public.classrooms as p")
      .where("p.id", "=", id)
      .selectAll()
      .executeTakeFirstOrThrow(
        () => new NotFoundException(`Classroom with id ${id} not found`),
      );
  }

  async update(
    id: string,
    updateClassroomDto: UpdateClassroomDto,
  ): Promise<Classroom> {
    const classroom = await this.db
      .updateTable("public.classrooms")
      .set(updateClassroomDto)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirstOrThrow(
        () => new NotFoundException(`Classroom with id ${id} not found`),
      );

    return classroom;
  }

  async remove(id: string): Promise<Classroom> {
    const classroom = await this.db
      .deleteFrom("public.classrooms")
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirstOrThrow(
        () => new NotFoundException(`Classroom with id ${id} not found`),
      );

    return classroom;
  }

  async generateUniqueRoomCode(length = 6): Promise<string> {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    while (true) {
      let code = "";
      for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const existing = await this.db
        .selectFrom("public.classrooms")
        .select("join_code")
        .where("join_code", "=", code)
        .executeTakeFirst();

      if (!existing) {
        return code;
      }
    }
  }
}
