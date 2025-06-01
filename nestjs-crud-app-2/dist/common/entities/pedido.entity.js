"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pedido = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const item_pedido_entity_1 = require("./item-pedido.entity");
let Pedido = class Pedido {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'pedidoId' }),
    __metadata("design:type", Number)
], Pedido.prototype, "pedidoId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId', referencedColumnName: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Pedido.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Pedido.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Pedido.prototype, "enderecoEntrega", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => item_pedido_entity_1.ItemPedido, (itemPedido) => itemPedido.pedido),
    __metadata("design:type", Array)
], Pedido.prototype, "itens", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Pedido.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Pedido.prototype, "updatedAt", void 0);
Pedido = __decorate([
    (0, typeorm_1.Entity)({ name: 'pedido' })
], Pedido);
exports.Pedido = Pedido;
