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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagamentosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pagamento_entity_1 = require("../common/entities/pagamento.entity");
const stripe_service_1 = require("./stripe.service");
let PagamentosService = class PagamentosService {
    constructor(pagamentoRepository, stripeService) {
        this.pagamentoRepository = pagamentoRepository;
        this.stripeService = stripeService;
    }
    findAll() {
        return this.pagamentoRepository.find();
    }
    findOne(id) {
        return this.pagamentoRepository.findOneBy({ pagamentoId: id });
    }
    create(pagamento) {
        const newPagamento = this.pagamentoRepository.create(pagamento);
        return this.pagamentoRepository.save(newPagamento);
    }
    async update(id, pagamento) {
        const existingPagamento = await this.findOne(id);
        if (!existingPagamento)
            return null;
        Object.assign(existingPagamento, pagamento);
        return this.pagamentoRepository.save(existingPagamento);
    }
    async remove(id) {
        const result = await this.pagamentoRepository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
    async updateStatusByStripeId(stripePaymentIntentId, status) {
        await this.pagamentoRepository.update({ stripePaymentIntentId }, { status });
    }
};
PagamentosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pagamento_entity_1.Pagamento)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        stripe_service_1.StripeService])
], PagamentosService);
exports.PagamentosService = PagamentosService;
