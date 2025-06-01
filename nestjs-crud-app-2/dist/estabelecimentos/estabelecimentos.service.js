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
exports.EstabelecimentosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const estabelecimento_entity_1 = require("../common/entities/estabelecimento.entity");
let EstabelecimentosService = class EstabelecimentosService {
    constructor(estabelecimentoRepository) {
        this.estabelecimentoRepository = estabelecimentoRepository;
    }
    async findAll(filtro) {
        const where = {};
        if (filtro === null || filtro === void 0 ? void 0 : filtro.nome)
            where.nome = filtro.nome;
        if (filtro === null || filtro === void 0 ? void 0 : filtro.cidade)
            where.endereco = filtro.cidade; // Ajuste se cidade for campo separado
        if (filtro === null || filtro === void 0 ? void 0 : filtro.status)
            where.status = filtro.status;
        return this.estabelecimentoRepository.find({ where });
    }
    findOne(id) {
        return this.estabelecimentoRepository.findOneBy({ estabelecimentoId: id });
    }
    create(estabelecimento) {
        const newEstabelecimento = this.estabelecimentoRepository.create(estabelecimento);
        return this.estabelecimentoRepository.save(newEstabelecimento);
    }
    async update(id, estabelecimento) {
        const existingEstabelecimento = await this.findOne(id);
        if (!existingEstabelecimento)
            return null;
        Object.assign(existingEstabelecimento, estabelecimento);
        return this.estabelecimentoRepository.save(existingEstabelecimento);
    }
    async remove(id) {
        const result = await this.estabelecimentoRepository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
    async findPendentes() {
        return this.estabelecimentoRepository.find({ where: { status: 'PENDENTE' } });
    }
};
EstabelecimentosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(estabelecimento_entity_1.Estabelecimento)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EstabelecimentosService);
exports.EstabelecimentosService = EstabelecimentosService;
