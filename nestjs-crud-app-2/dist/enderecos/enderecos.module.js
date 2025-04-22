"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnderecosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const enderecos_controller_1 = require("./enderecos.controller");
const enderecos_service_1 = require("./enderecos.service");
const endereco_entity_1 = require("../common/entities/endereco.entity");
let EnderecosModule = class EnderecosModule {
};
EnderecosModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([endereco_entity_1.Endereco])],
        controllers: [enderecos_controller_1.EnderecosController],
        providers: [enderecos_service_1.EnderecosService],
    })
], EnderecosModule);
exports.EnderecosModule = EnderecosModule;
