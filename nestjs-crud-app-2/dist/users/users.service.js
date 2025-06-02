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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async create(createUserDto) {
        try {
            const user = this.usersRepository.create(Object.assign(Object.assign({}, createUserDto), { role: createUserDto.role || user_entity_1.UserRole.USER, profileType: createUserDto.profileType || user_entity_1.UserProfileType.CUSTOMER, isEmailVerified: createUserDto.isEmailVerified || false, provider: createUserDto.senha ? 'local' : (createUserDto.provider || 'google') }));
            return await this.usersRepository.save(user);
        }
        catch (error) {
            if (error instanceof Error && 'code' in error && error.code === '23505') {
                throw new common_1.ConflictException('Email já está em uso');
            }
            throw error;
        }
    }
    async findByEmail(email) {
        return this.usersRepository.findOne({ where: { email } });
    }
    async findById(userId) {
        const user = await this.usersRepository.findOne({ where: { userId } });
        if (!user)
            throw new Error('Usuário não encontrado');
        return user;
    }
    async update(userId, updateUserDto) {
        const user = await this.findById(userId);
        Object.assign(user, updateUserDto);
        return this.usersRepository.save(user);
    }
    async remove(userId) {
        const user = await this.findById(userId);
        await this.usersRepository.remove(user);
    }
    async findAll(filtro) {
        // Exemplo de filtro: { nome, email, perfil, status }
        // Ajuste conforme sua estrutura de entidade
        const where = {};
        if (filtro === null || filtro === void 0 ? void 0 : filtro.nome)
            where.firstName = filtro.nome;
        if (filtro === null || filtro === void 0 ? void 0 : filtro.email)
            where.email = filtro.email;
        // Adicione outros filtros conforme necessário
        return this.usersRepository.find({ where });
    }
    async findOneDetalhado(userId) {
        // Retorna o usuário com perfis e histórico de pedidos (ajuste relations conforme necessário)
        return this.usersRepository.findOne({ where: { userId }, relations: ['perfis'] });
    }
    async alterarStatus(userId, status) {
        const user = await this.findById(userId);
        user.status = status;
        return this.usersRepository.save(user);
    }
    async alterarPerfis(userId, perfis) {
        const user = await this.findById(userId);
        // Ajuste conforme sua lógica de perfis
        // user.perfis = perfis;
        return this.usersRepository.save(user);
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
exports.UsersService = UsersService;
