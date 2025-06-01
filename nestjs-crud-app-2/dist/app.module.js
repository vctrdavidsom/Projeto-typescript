"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const path_1 = require("path");
const serve_static_1 = require("@nestjs/serve-static");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const products_module_1 = require("./products/products.module");
const categories_module_1 = require("./categories/categories.module");
const usuarios_module_1 = require("./usuarios/usuarios.module");
const pedidos_module_1 = require("./pedidos/pedidos.module");
const entregas_module_1 = require("./entregas/entregas.module");
const enderecos_module_1 = require("./enderecos/enderecos.module");
const estabelecimentos_module_1 = require("./estabelecimentos/estabelecimentos.module");
const cupons_module_1 = require("./cupons/cupons.module");
const pagamentos_module_1 = require("./pagamentos/pagamentos.module");
const itens_pedido_module_1 = require("./itens-pedido/itens-pedido.module");
const upload_module_1 = require("./upload/upload.module");
const throttler_1 = require("@nestjs/throttler");
const throttler_2 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const memory_session_guard_1 = require("./auth/guards/memory-session.guard");
const perfil_usuario_module_1 = require("./perfil-usuario/perfil-usuario.module");
const vendedor_module_1 = require("./vendedor/vendedor.module");
const entregador_module_1 = require("./entregador/entregador.module");
const minha_conta_controller_1 = require("./auth/minha-conta.controller");
const admin_module_1 = require("./admin/admin.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60,
                    limit: 10, // 10 requests per minute
                }]),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'better-sqlite3',
                database: (0, path_1.join)(process.cwd(), 'database.sqlite'),
                entities: [(0, path_1.join)(__dirname, '/**/*.entity{.ts,.js}')],
                synchronize: true, // Habilita sincronização automática
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'uploads'),
                serveRoot: '/uploads',
                exclude: ['/api*'],
            }),
            // Módulos de autenticação primeiro
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            // Demais módulos
            products_module_1.ProductsModule,
            categories_module_1.CategoriesModule,
            usuarios_module_1.UsuariosModule,
            pedidos_module_1.PedidosModule,
            entregas_module_1.EntregasModule,
            enderecos_module_1.EnderecosModule,
            estabelecimentos_module_1.EstabelecimentosModule,
            cupons_module_1.CuponsModule,
            pagamentos_module_1.PagamentosModule,
            itens_pedido_module_1.ItensPedidoModule,
            upload_module_1.UploadModule,
            perfil_usuario_module_1.PerfilUsuarioModule,
            vendedor_module_1.VendedorModule,
            entregador_module_1.EntregadorModule,
            admin_module_1.AdminModule,
        ],
        controllers: [app_controller_1.AppController, minha_conta_controller_1.MinhaContaController],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: memory_session_guard_1.MemorySessionGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_2.ThrottlerGuard,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
