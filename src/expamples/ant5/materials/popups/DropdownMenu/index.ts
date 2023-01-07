import { IComponentMaterial } from "core-react";
import { DropdownMenu } from "expamples/ant5/components/popups/DropdownMenu";
import { DropdownMenuDesigner } from "./designer";
import { locales } from "./locales";
import { materialSchema } from "./schema";

const name = "DropdownMenu"
export const DropdownMenuMaterial: IComponentMaterial = {
  componentName: name,
  component: DropdownMenu,
  designer: DropdownMenuDesigner,
  designerLocales: locales,
  designerSchema: materialSchema,
  designerProps: {
    //readOnly: true,
  },
  slots: {
    menuItem: true,
  },
  behaviorRule: {
    droppable: false,
    noPlaceholder: true,
  }
}