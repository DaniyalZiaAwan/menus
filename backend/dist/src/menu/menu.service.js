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
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let MenuService = class MenuService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateMenuExistence(id) {
        const menu = await this.prisma.menu.findUnique({ where: { id } });
        if (!menu) {
            throw new common_1.NotFoundException(`Menu with ID ${id} not found`);
        }
    }
    async fetchAllMenus() {
        const menus = await this.prisma.menu.findMany();
        if (!menus.length) {
            throw new common_1.NotFoundException('No menus found');
        }
        return menus;
    }
    async getAllMenus() {
        try {
            const allMenus = await this.fetchAllMenus();
            const buildHierarchy = (parentId, parentName = null) => {
                return allMenus
                    .filter((menu) => menu.parentId === parentId)
                    .map((menu) => ({
                    ...menu,
                    parentName,
                    children: buildHierarchy(menu.id, menu.name),
                }));
            };
            return buildHierarchy(null);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || 'Failed to fetch menus');
        }
    }
    async getMenuById(id) {
        try {
            const allMenus = await this.fetchAllMenus();
            const rootMenu = allMenus.find((menu) => menu.id === id);
            if (!rootMenu) {
                throw new common_1.NotFoundException(`Menu with ID ${id} not found`);
            }
            const buildHierarchy = (parentId, parentName = null) => {
                return allMenus
                    .filter((menu) => menu.parentId === parentId)
                    .map((menu) => ({
                    ...menu,
                    parentName,
                    children: buildHierarchy(menu.id, menu.name),
                }));
            };
            return {
                ...rootMenu,
                parentName: rootMenu.parentId
                    ? allMenus.find((menu) => menu.id === rootMenu.parentId)?.name || null
                    : null,
                children: buildHierarchy(rootMenu.id, rootMenu.name),
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || 'Failed to fetch menu by ID');
        }
    }
    async createMenu(name, parentId) {
        try {
            let depth = 0;
            if (!name) {
                throw new common_1.NotFoundException(`Name is required`);
            }
            if (parentId) {
                const parentMenu = await this.prisma.menu.findUnique({
                    where: { id: parentId },
                });
                if (!parentMenu) {
                    throw new common_1.NotFoundException(`Parent menu with ID ${parentId} not found`);
                }
                depth = parentMenu.depth + 1;
            }
            return await this.prisma.menu.create({
                data: { name, parentId, depth },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || 'Failed to create menu');
        }
    }
    async updateMenu(id, name) {
        try {
            await this.validateMenuExistence(id);
            return await this.prisma.menu.update({
                where: { id },
                data: { name },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || 'Failed to update menu');
        }
    }
    async deleteMenu(id) {
        try {
            await this.validateMenuExistence(id);
            const getAllChildren = async (parentId) => {
                const children = await this.prisma.menu.findMany({
                    where: { parentId },
                });
                let childIds = children.map((child) => child.id);
                for (const child of children) {
                    childIds = [...childIds, ...(await getAllChildren(child.id))];
                }
                return childIds;
            };
            const allChildIds = await getAllChildren(id);
            if (allChildIds.length > 0) {
                await this.prisma.menu.deleteMany({
                    where: { id: { in: allChildIds } },
                });
            }
            return await this.prisma.menu.delete({ where: { id } });
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || 'Failed to delete menu');
        }
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MenuService);
//# sourceMappingURL=menu.service.js.map