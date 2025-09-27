"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMinigameDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_minigame_dto_1 = require("./create-minigame.dto");
class UpdateMinigameDto extends (0, swagger_1.PartialType)(create_minigame_dto_1.CreateMinigameDto) {
}
exports.UpdateMinigameDto = UpdateMinigameDto;
//# sourceMappingURL=update-minigame.dto.js.map