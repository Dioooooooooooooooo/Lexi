import {
 Controller,
 Get,
 Post,
 Body,
 Patch,
 Param,
 Delete,
 UseGuards,
 HttpStatus,
 HttpCode,
} from "@nestjs/common";
import { MinigamesService } from "./minigames.service";
import { CreateMinigameDto } from "./dto/create-minigame.dto";
import { UpdateMinigameDto } from "./dto/update-minigame.dto";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { MinigameType } from "@/database/schemas";
import { CreateMinigameLogDto } from "./dto/create-minigame-log.dto";

@UseGuards(AuthGuard("jwt"))
@ApiBearerAuth("JWT-auth")
@Controller("minigames")
export class MinigamesController {
 constructor(private readonly minigamesService: MinigamesService) {}
 /*
        GET /minigames/readingmaterials/:readingMaterialID/random
        GET /minigames/:readingSessionID/complete
        GET /minigames/:readingSessionID/random
    */

 @Get("readingmaterials/:readingMaterialID/random")
 @ApiOperation({
  summary: "Get 3 random minigames for a specific reading material",
 })
 findMinigamesByMaterialID(
  @Param("readingMaterialID") readingMaterialID: string
 ) {
  // Logic to fetch random minigames for a specific reading material
  // return `Random minigames for reading material ID: ${readingMaterialID}`;
  return this.minigamesService.getRandomMinigamesByMaterialID(
   readingMaterialID
  );
 }

 @Get(":readingSessionID/random")
 @ApiOperation({
  summary: "Get 3 random minigames for a specific reading session",
 })
 findMinigamesBySessionID(@Param("readingSessionID") readingSessionID: string) {
  // Logic to fetch random minigames for a specific reading session
  // return `Random minigames for reading session ID: ${readingSessionID}`;
  return this.minigamesService.getRandomMinigamesBySessionID(readingSessionID);
 }

 @Get(":readingMaterialID/wordsFromLetters")
 @ApiOperation({
  summary: "Get WordsFromLetters minigame for a specific reading material",
 })
 findWordsFromLettersMinigame(
  @Param("readingMaterialID") readingMaterialID: string
 ) {
  // Logic to fetch WordsFromLetters minigame for a specific reading material
  // return `WordsFromLetters minigame for reading material ID: ${readingMaterialID}`;
  return this.minigamesService.getWordsFromLettersMinigame(readingMaterialID);
 }

 @Post(":readingSessionID/complete")
 @ApiOperation({
  summary:
   "Create a completion status of minigames for a specific reading session",
 })
 @HttpCode(HttpStatus.CREATED)
 getMinigamesCompletion(@Param("readingSessionID") readingSessionID: string) {
  // Logic to fetch completion status of minigames for a specific reading session
  // return `Minigames completion for reading session ID: ${readingSessionID}`;
  return this.minigamesService.createMinigamesCompletion(readingSessionID);
 }

 @Post("logs/SentenceRearrangement")
 @ApiOperation({
  summary: "Create a log for SentenceRearrangement minigame",
 })
 createSentenceRearrangementLog(@Body() minigameLogDto: CreateMinigameLogDto) {
  return this.minigamesService.createMinigameLog(
   MinigameType.SentenceRearrangement,
   minigameLogDto
  );
 }

 @Post("logs/Choices")
 @ApiOperation({
  summary: "Create a log for Choices minigame",
 })
 createChoicesLog(@Body() minigameLogDto: CreateMinigameLogDto) {
  return this.minigamesService.createMinigameLog(
   MinigameType.Choices,
   minigameLogDto
  );
 }

 @Post("logs/WordsFromLetters")
 @ApiOperation({
  summary: "Create a log for WordsFromLetters minigame",
 })
 createWordsFromLettersLog(@Body() minigameLogDto: CreateMinigameLogDto) {
  return this.minigamesService.createMinigameLog(
   MinigameType.WordsFromLetters,
   minigameLogDto
  );
 }
}
