import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ReadingSessionsService } from "./reading-sessions.service";
import { CreateReadingSessionDto } from "./dto/create-reading-session.dto";
import { UpdateReadingSessionDto } from "./dto/update-reading-session.dto";
import { RolesGuard } from "../auth/role-guard";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "@/decorators/roles.decorator";

@Controller("reading-sessions")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@ApiBearerAuth("JWT-auth")
@Roles(["Pupil"])
export class ReadingSessionsController {
  constructor(
    private readonly readingSessionsService: ReadingSessionsService,
  ) {}

  @Post()
  async create(@Body() createReadingSessionDto: CreateReadingSessionDto) {
    const newSession = await this.readingSessionsService.create(
      createReadingSessionDto,
    );

    return {
      message: "Reading session created successfully",
      data: newSession,
    };
  }

  @Get()
  async findAll() {
    const readingSessions = await this.readingSessionsService.findAll();

    return {
      message: "Reading sessions fetched successfully",
      data: readingSessions,
    };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const readingSession = await this.readingSessionsService.findOne(id);

    return {
      message: "Reading session fetched successfully",
      data: readingSession,
    };
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateReadingSessionDto: UpdateReadingSessionDto,
  ) {
    const updatedReadingSession = await this.readingSessionsService.update(
      id,
      updateReadingSessionDto,
    );

    return {
      message: "Reading session updated successfully",
      data: updatedReadingSession,
    };
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    const deletedReadingSession = await this.readingSessionsService.remove(id);

    return {
      message: "Reading session updated successfully",
      data: deletedReadingSession,
    };
  }
}
