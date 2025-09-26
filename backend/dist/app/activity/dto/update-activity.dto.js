"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateActivityDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_activity_dto_1 = require("./create-activity.dto");
class UpdateActivityDTO extends (0, swagger_1.PartialType)(create_activity_dto_1.CreateActivityDTO) {
}
exports.UpdateActivityDTO = UpdateActivityDTO;
//# sourceMappingURL=update-activity.dto.js.map