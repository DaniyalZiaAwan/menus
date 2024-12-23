import { MenuService } from './menu.service';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    getAllMenus(): Promise<any>;
    getMenuById(id: string): Promise<any>;
    createMenu(body: {
        name: string;
        parentId: string | null;
    }): Promise<{
        id: string;
        name: string;
        parentId: string | null;
        depth: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateMenu(id: string, body: {
        name: string;
    }): Promise<{
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
