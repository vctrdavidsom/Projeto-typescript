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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagamentosController = void 0;
const common_1 = require("@nestjs/common");
const pagamentos_service_1 = require("./pagamentos.service");
const pagamento_entity_1 = require("../common/entities/pagamento.entity");
const stripe_service_1 = require("./stripe.service");
const stripe_1 = __importDefault(require("stripe"));
let PagamentosController = class PagamentosController {
    constructor(pagamentosService, stripeService) {
        this.pagamentosService = pagamentosService;
        this.stripeService = stripeService;
    }
    create(pagamento) {
        return this.pagamentosService.create(pagamento);
    }
    findAll() {
        return this.pagamentosService.findAll();
    }
    findOne(id) {
        return this.pagamentosService.findOne(id);
    }
    update(id, pagamento) {
        return this.pagamentosService.update(id, pagamento);
    }
    remove(id) {
        return this.pagamentosService.remove(id);
    }
    async createPaymentIntent(body) {
        // valor em centavos (ex: 10,00 BRL = 1000)
        const paymentIntent = await this.stripeService.createPaymentIntent(body.valor, body.moeda);
        return { client_secret: paymentIntent.client_secret };
    }
    async handleStripeWebhook(req, res, sig) {
        const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-05-28.basil', // Corrigido para a versão esperada pelo pacote stripe
        });
        let event;
        try {
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        }
        catch (err) {
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
        // Trate eventos relevantes
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            // Atualize o status do pagamento no banco de dados
            await this.pagamentosService.updateStatusByStripeId(paymentIntent.id, 'SUCCEEDED');
        }
        else if (event.type === 'payment_intent.payment_failed') {
            const paymentIntent = event.data.object;
            await this.pagamentosService.updateStatusByStripeId(paymentIntent.id, 'FAILED');
        }
        res.status(200).json({ received: true });
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagamento_entity_1.Pagamento]),
    __metadata("design:returntype", Promise)
], PagamentosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PagamentosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PagamentosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PagamentosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PagamentosController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('intent'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PagamentosController.prototype, "createPaymentIntent", null);
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], PagamentosController.prototype, "handleStripeWebhook", null);
PagamentosController = __decorate([
    (0, common_1.Controller)('pagamentos'),
    __metadata("design:paramtypes", [pagamentos_service_1.PagamentosService,
        stripe_service_1.StripeService])
], PagamentosController);
exports.PagamentosController = PagamentosController;
