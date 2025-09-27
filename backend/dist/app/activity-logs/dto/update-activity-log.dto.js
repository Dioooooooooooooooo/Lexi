"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateActivityLogDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_activity_log_dto_1 = require("./create-activity-log.dto");
class UpdateActivityLogDto extends (0, swagger_1.PartialType)(create_activity_log_dto_1.CreateActivityLogDto) {
}
exports.UpdateActivityLogDto = UpdateActivityLogDto;
//# sourceMappingURL=update-activity-log.dto.js.map