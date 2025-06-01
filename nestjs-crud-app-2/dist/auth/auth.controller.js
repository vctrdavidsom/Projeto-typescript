"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const roles_guard_1 = require("./guards/roles.guard");
const role_enum_1 = require("./role.enum");
const roles_decorator_1 = require("./roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const public_decorator_1 = require("./decorators/public.decorator");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async googleAuth() {
        // O guard redirecionará para a página de login do Google
    }
    async googleAuthCallback(req, res) {
        const user = await this.authService.validateGoogleUser(req.user);
        const result = await this.authService.login(user);
        // Adiciona o token à sessão em memória
        const { MemorySessionGuard } = await Promise.resolve().then(() => __importStar(require('./guards/memory-session.guard')));
        MemorySessionGuard.addToken(result.access_token);
        return res.status(200).json({ access_token: result.access_token });
    }
    authSuccess(token, res) {
        // Agora não é mais necessário, mas pode ser removido se não for usado em outro lugar
        res.status(200).json({ message: 'Login com Google realizado com sucesso.' });
    }
    async getUserProfile(req) {
        return this.authService.getUserProfile(req.user.id);
    }
    async updateProfile(id, profileType) {
        return this.authService.updateUserProfile(id, profileType);
    }
    async updateRole(id, role) {
        return this.authService.updateUserRole(id, role);
    }
    async login(loginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.senha);
        const result = await this.authService.login(user);
        // Adiciona o token à sessão em memória para funcionar com MemorySessionGuard
        const { MemorySessionGuard } = await Promise.resolve().then(() => __importStar(require('./guards/memory-session.guard')));
        MemorySessionGuard.addToken(result.access_token);
        return result;
    }
    async logout(req) {
        const authHeader = req.headers['authorization'];
        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            const { MemorySessionGuard } = await Promise.resolve().then(() => __importStar(require('./guards/memory-session.guard')));
            MemorySessionGuard.removeToken(token);
        }
        return { message: 'Logout realizado com sucesso.' };
    }
};
__decorate([
    (0, common_1.Get)('google'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    (0, swagger_1.ApiOperation)({ summary: 'Iniciar autenticação com Google' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    (0, swagger_1.ApiOperation)({ summary: 'Callback da autenticação com Google' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Usuário autenticado com sucesso' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthCallback", null);
__decorate([
    (0, common_1.Get)('success'),
    (0, swagger_1.ApiOperation)({ summary: 'Página de sucesso após autenticação' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login bem-sucedido' }),
    __param(0, (0, common_1.Query)('token')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "authSuccess", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obter perfil do usuário logado' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Perfil do usuário' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autorizado' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUserProfile", null);
__decorate([
    (0, common_1.Put)('profile/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.CUSTOMER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar tipo de perfil do usuário' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Perfil atualizado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Acesso negado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('profileType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Put)('role/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar role do usuário (apenas admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role atualizada com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Acesso negado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Login com email e senha' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login realizado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Credenciais inválidas' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiOperation)({ summary: 'Logout do usuário' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
