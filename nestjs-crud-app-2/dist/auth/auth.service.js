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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const user_entity_1 = require("../users/entities/user.entity");
const bcrypt = __importStar(require("bcryptjs"));
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.MAX_LOGIN_ATTEMPTS = 5;
        this.LOCK_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds
    }
    async validateUser(email, senha) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        // Só permite login local para admin
        if (user.role === 'admin' && user.provider !== 'local') {
            throw new common_1.UnauthorizedException('Admin só pode logar via autenticação local');
        }
        // Verifica hash para admin/local
        if (user.provider === 'local') {
            const senhaValida = await bcrypt.compare(senha, user.senha || '');
            if (!senhaValida) {
                throw new common_1.UnauthorizedException('Credenciais inválidas');
            }
        }
        else {
            // Google: só permite se não for admin
            if (user.role === 'admin') {
                throw new common_1.UnauthorizedException('Admin só pode logar via autenticação local');
            }
            if (user.senha !== senha) {
                throw new common_1.UnauthorizedException('Credenciais inválidas');
            }
        }
        await this.handleSuccessfulLogin(user);
        return user;
    }
    async handleSuccessfulLogin(user) {
        // Reset login attempts on successful login
        await this.usersService.update(user.userId, {
            loginAttempts: 0,
            lastLoginAt: new Date(),
            lockedUntil: undefined,
        });
    }
    async checkAccountLock(user) {
        if (user.loginAttempts >= this.MAX_LOGIN_ATTEMPTS) {
            if (user.lockedUntil && user.lockedUntil > new Date()) {
                throw new common_1.UnauthorizedException('Conta bloqueada temporariamente. Tente novamente em 15 minutos.');
            }
            // Reset attempts if lock time has passed
            await this.usersService.update(user.userId, {
                loginAttempts: 0,
                lockedUntil: undefined,
                lastLoginAt: new Date(),
            });
        }
    }
    async validateGoogleUser(profile) {
        const { email, firstName, lastName, picture } = profile;
        let user = await this.usersService.findByEmail(email);
        if (!user) {
            user = await this.usersService.create({
                email,
                firstName,
                lastName,
                picture,
                provider: 'google',
                isEmailVerified: true,
                role: user_entity_1.UserRole.USER,
                profileType: user_entity_1.UserProfileType.CUSTOMER,
            });
        }
        await this.handleSuccessfulLogin(user);
        return user;
    }
    async login(user) {
        await this.checkAccountLock(user);
        const payload = {
            sub: user.userId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            profileType: user.profileType,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.userId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                picture: user.picture,
                role: user.role,
                profileType: user.profileType,
            },
        };
    }
    async getUserProfile(userId) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('Usuário não encontrado');
        }
        // Remove sensitive information
        const { senha, loginAttempts, lockedUntil } = user, userProfile = __rest(user, ["senha", "loginAttempts", "lockedUntil"]);
        return userProfile;
    }
    async updateUserProfile(userId, profileType) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return this.usersService.update(userId, { profileType });
    }
    async updateUserRole(userId, role) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        // Only admins can change roles
        if (user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('Only administrators can change user roles');
        }
        return this.usersService.update(userId, { role });
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
