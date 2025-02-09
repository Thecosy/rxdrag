import { INodeSchema } from "@rxdrag/schema";
import { labelSchema } from "../../baseSchema";

export const collectToArray: INodeSchema = {
  componentName: "Fragment",
  children: [
    labelSchema,
    {
      componentName: "FormItem",
      props: {
        label: "$inputPorts",
      },
      children: [
        {
          componentName: "PortsInput",
          "x-field": {
            name: "inPorts",
            params: {
              withBind: true,
            }
          },
          props: {
            title: "$configPorts",
            popoverTitle: "$inputPortsConfig",
            type: "input",
          }
        }
      ]
    },
  ],
}