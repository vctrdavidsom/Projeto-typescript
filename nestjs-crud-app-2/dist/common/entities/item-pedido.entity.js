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
exports.ItemPedido = void 0;
const typeorm_1 = require("typeorm");
const pedido_entity_1 = require("./pedido.entity");
let ItemPedido = class ItemPedido {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'item_pedidoId' }),
    __metadata("design:type", Number)
], ItemPedido.prototype, "itemPedidoId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ItemPedido.prototype, "produtoId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ItemPedido.prototype, "quantidade", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pedido_entity_1.Pedido, (pedido) => pedido.itens, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'pedidoId', referencedColumnName: 'pedidoId' }),
    __metadata("design:type", pedido_entity_1.Pedido)
], ItemPedido.prototype, "pedido", void 0);
ItemPedido = __decorate([
    (0, typeorm_1.Entity)({ name: 'item_pedido' })
], ItemPedido);
exports.ItemPedido = ItemPedido;
