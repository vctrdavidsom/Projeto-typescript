"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const pedidos_controller_1 = require("./pedidos.controller");
const pedidos_service_1 = require("./pedidos.service");
const pedido_entity_1 = require("../common/entities/pedido.entity");
const users_module_1 = require("../users/users.module");
const enderecos_module_1 = require("../enderecos/enderecos.module");
let PedidosModule = class PedidosModule {
};
PedidosModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([pedido_entity_1.Pedido]), users_module_1.UsersModule, enderecos_module_1.EnderecosModule],
        controllers: [pedidos_controller_1.PedidosController],
        providers: [pedidos_service_1.PedidosService],
        exports: [pedidos_service_1.PedidosService], // exporta o service para outros módulos
    })
], PedidosModule);
exports.PedidosModule = PedidosModule;
