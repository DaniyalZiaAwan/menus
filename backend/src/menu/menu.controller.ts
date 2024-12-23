import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MenuService } from './menu.service';

@Controller('api/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  getAllMenus() {
    return this.menuService.getAllMenus();
  }

  @Get(':id')
  getMenuById(@Param('id') id: string) {
    return this.menuService.getMenuById(id);
  }

  @Post()
  createMenu(@Body() body: { name: string; parentId: string | null }) {
    return this.menuService.createMenu(body.name, body.parentId);
  }

  @Put(':id')
  updateMenu(@Param('id') id: string, @Body() body: { name: string }) {
    return this.menuService.updateMenu(id, body.name);
  }

  @Delete(':id')
  deleteMenu(@Param('id') id: string) {
    return this.menuService.deleteMenu(id);
  }
}
