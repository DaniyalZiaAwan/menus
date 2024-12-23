"use client";
import { useEffect, useState } from "react";
import DropdownSelect from "./components/DropdownSelect";
import TreeNode, { TreeNodeData } from "./components/TreeNode";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import {
  fetchMenus,
  addMenu,
  deleteMenu,
  updateMenu,
  setSelectedMenu,
  setMenuForm,
} from "./redux/menuSlice";
import MenuForm from "./components/MenuForm";

const Home: React.FC<void> = () => {
  const [globalExpand, setGlobalExpand] = useState(false); // For expand/collapse all

  const dispatch = useAppDispatch();
  const menus = useAppSelector((state) => state.menu.menus);
  const selectedMenu = useAppSelector((state) => state.menu.selectedMenu);
  const menuForm = useAppSelector((state) => state.menu.menuForm);

  useEffect(() => {
    dispatch(fetchMenus());
  }, [dispatch]);

  const handleMenuChange = (selectedOption: TreeNodeData) => {
    dispatch(setSelectedMenu([selectedOption]));
  };

  const handleExpandAll = () => setGlobalExpand(true);
  const handleCollapseAll = () => setGlobalExpand(false);

  const handleEditNode = (node: TreeNodeData) => {
    dispatch(setMenuForm(node)); // Populate the form with the selected node data
  };

  const handleDeleteNode = (nodeId: string) => {
    dispatch(deleteMenu(nodeId));
  };

  const handleAddNode = (parentNode: TreeNodeData) => {
    dispatch(
      setMenuForm({
        parentId: parentNode.id,
        parentName: parentNode?.name,
      })
    );
  };

  const onSaveMenu = () => {
    if (!selectedMenu?.length) {
      dispatch(addMenu({ name: menuForm?.name }));
    } else if (menuForm?.parentId && !menuForm?.id) {
      dispatch(addMenu(menuForm));
    } else if (menuForm?.id) {
      dispatch(updateMenu(menuForm));
    }
  };

  return (
    <div className="p-8">
      <p className="text-2xl font-black">Menus</p>
      <p className="text-sm mb-2 text-gray-600 mt-8">Menu</p>
      <div className="w-full md:w-80">
        <DropdownSelect options={menus} onChange={handleMenuChange} />
      </div>

      <div className="flex flex-col lg:flex-row mt-8 gap-8">
        {/* Sidebar */}
        <aside className="lg:min-w-[400px] rounded-lg">
          <div className="flex flex-wrap">
            <button
              className="text-white rounded-full bg-black p-2 px-6 font-bold mr-4"
              onClick={handleExpandAll}
            >
              Expand All
            </button>
            <button
              className="text-black rounded-full bg-white p-2 px-6 font-bold border border-gray-400"
              onClick={handleCollapseAll}
            >
              Collapse All
            </button>
          </div>
          <div className="my-6">
            {selectedMenu.map((node, index) => (
              <TreeNode
                key={index}
                node={node}
                globalExpand={globalExpand}
                onEdit={handleEditNode}
                onDelete={handleDeleteNode}
                onAdd={handleAddNode}
              />
            ))}
          </div>
        </aside>

        {/* Detail Panel */}
        <main className="lg:min-w-[400px] lg:ml-32 bg-white p-4 rounded-lg">
          <MenuForm
            onSaveMenu={onSaveMenu}
          />
        </main>
      </div>
    </div>
  );
};

export default Home;
