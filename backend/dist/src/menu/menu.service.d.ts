import { PrismaService } from '../../prisma/prisma.service';
export declare class MenuService {
    private prisma;
    constructor(prisma: PrismaService);
    private validateMenuExistence;
    private fetchAllMenus;
    getAllMenus(): Promise<any>;
    getMenuById(id: string): Promise<any>;
    createMenu(name: string, parentId: string | null): Promise<{
        id: string;
        name: string;
        parentId: string | null;
        depth: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateMenu(id: string, name: string): Promise<{
        id: string;
        name: string;
        parentId: string | null;
        depth: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteMenu(id: string): Promise<{
        id: string;
        name: string;
        parentId: string | null;
        depth: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
