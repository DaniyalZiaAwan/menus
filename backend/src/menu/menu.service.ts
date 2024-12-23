import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  private async validateMenuExistence(id: string): Promise<void> {
    const menu = await this.prisma.menu.findUnique({ where: { id } });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
  }

  private async fetchAllMenus(): Promise<any[]> {
    const menus = await this.prisma.menu.findMany();
    if (!menus.length) {
      throw new NotFoundException('No menus found');
    }
    return menus;
  }

  async getAllMenus() {
    try {
      const allMenus = await this.fetchAllMenus();

      const buildHierarchy = (
        parentId: string | null,
        parentName: string | null = null,
      ) => {
        return allMenus
          .filter((menu) => menu.parentId === parentId)
          .map((menu) => ({
            ...menu,
            parentName,
            children: buildHierarchy(menu.id, menu.name),
          }));
      };

      return buildHierarchy(null);
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to fetch menus');
    }
  }

  async getMenuById(id: string) {
    try {
      const allMenus = await this.fetchAllMenus();
      const rootMenu = allMenus.find((menu) => menu.id === id);

      if (!rootMenu) {
        throw new NotFoundException(`Menu with ID ${id} not found`);
      }

      const buildHierarchy = (
        parentId: string,
        parentName: string | null = null,
      ) => {
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
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to fetch menu by ID',
      );
    }
  }

  async createMenu(name: string, parentId: string | null) {
    try {
      let depth = 0;
      if (!name) {
        throw new NotFoundException(
          `Name is required`,
        );
      }
      if (parentId) {
        const parentMenu = await this.prisma.menu.findUnique({
          where: { id: parentId },
        });
        if (!parentMenu) {
          throw new NotFoundException(
            `Parent menu with ID ${parentId} not found`,
          );
        }
        depth = parentMenu.depth + 1;
      }

      return await this.prisma.menu.create({
        data: { name, parentId, depth },
      });
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to create menu');
    }
  }

  async updateMenu(id: string, name: string) {
    try {
      await this.validateMenuExistence(id);
      return await this.prisma.menu.update({
        where: { id },
        data: { name },
      });
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to update menu');
    }
  }

  async deleteMenu(id: string) {
    try {
      await this.validateMenuExistence(id);

      // Find all children of the menu recursively
      const getAllChildren = async (parentId: string): Promise<string[]> => {
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

      // Delete all child menus
      if (allChildIds.length > 0) {
        await this.prisma.menu.deleteMany({
          where: { id: { in: allChildIds } },
        });
      }

      // Delete the root menu
      return await this.prisma.menu.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to delete menu');
    }
  }
}
