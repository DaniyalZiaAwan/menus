/* eslint-disable  @typescript-eslint/no-explicit-any */
import React from "react";
import InputField from "./InputField";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setMenuForm } from "../redux/menuSlice";

interface MenuFormProps {
  onSaveMenu?: () => void;
}

const MenuForm: React.FC<MenuFormProps> = ({ onSaveMenu }) => {
  const selectedMenu = useAppSelector((state) => state.menu.selectedMenu);
  const menuForm = useAppSelector((state) => state.menu.menuForm);
  const dispatch = useAppDispatch();
  const handleInputChange = (field: string, value: any) => {
    dispatch(setMenuForm({ ...menuForm, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div>
        <InputField
          label="Menu ID"
          value={menuForm?.id || ""}
          onChange={(value) => handleInputChange("id", value)}
          readOnly={true}
        />
      </div>
      <div>
        <InputField
          label="Depth"
          value={menuForm?.depth || ""}
          onChange={(value) => handleInputChange("depth", value)}
          readOnly={true}
        />
      </div>
      <div>
        <InputField
          label="Parent Data"
          value={menuForm?.parentName || ""}
          onChange={(value) => handleInputChange("parent", value)}
          readOnly={true}
        />
      </div>
      <div>
        <InputField
          label="Name"
          value={menuForm?.name || ""}
          onChange={(value) => handleInputChange("name", value)}
        />
      </div>
      <button
        onClick={onSaveMenu}
        className="bg-primary-blue text-white font-bold px-4 py-2 rounded-full w-full lg:w-40 mt-4"
      >
        {selectedMenu?.length || menuForm?.id ? "Save" : "Create"}
      </button>
    </div>
  );
};

export default MenuForm;
