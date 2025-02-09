import { IBindParams } from "@rxdrag/react-runner"
import { INodeSchema} from "@rxdrag/schema"
import { attachFormItem } from "./attachFormItem"
import { IFieldMeta } from "@rxdrag/fieldy-schema"
import { ILogicFlowControllerMeta } from "@rxdrag/minions-runtime-react"

export type FieldOptions = {
  canBindField?: boolean,
}

export interface IExpressionField {
  label: string,
  name: string,
  valueInputSchema: INodeSchema<IFieldMeta<IBindParams>, ILogicFlowControllerMeta>,
}

export function transformExpresionField(expFields: IExpressionField[]) {
  return expFields.map(expField => {
    return {
      componentName: "FormItem",
      props: {
        label: expField.label,
      },
      "x-field": {
        type: "object",
        name: expField.name,
      },
      children: [
        {
          componentName: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
            }
          },
          children: [
            expField.valueInputSchema,
            {
              componentName: "ExpressionInput",
              props: {
                style: {
                  marginLeft: 8,
                }
              },
              "x-field": {
                name: "expression",
                params: {
                  withBind: true,
                }
              },
            }
          ]
        }
      ]
    }
  })
}

export function createFieldSchema(fieldOptions?: FieldOptions) {
  const reactionFields: IExpressionField[] = [
    // 有可能会导致死循环，暂时不用value
    // {
    //   label: "$value",
    //   name: "value",
    //   valueInputSchema: {
    //     componentName: "ValueInput",
    //     "x-field": {
    //       name: "value",
    //       params: {
    //         withBind: true,
    //       }
    //     },
    //   },
    // },
    {
      label: "$display",
      name: "display",
      valueInputSchema: {
        componentName: "Select",
        props: {
          style: {
            flex: 1,
          },
          options: [
            {
              value: '',
              label: '',
            },
            {
              value: 'none',
              label: 'none',
            },
            {
              value: 'hidden',
              label: 'hidden',
            },
            {
              value: 'visible',
              label: 'visible',
            },
          ],
        },
        "x-field": {
          name: "value",
          params: {
            withBind: true,
          }
        },
      },
    },
    {
      label: "$pattern",
      name: "pattern",
      valueInputSchema: {
        componentName: "Select",
        props: {
          style: {
            flex: 1,
          },
          options: [
            {
              value: '',
              label: '',
            },
            {
              value: 'editable',
              label: '$editable',
            },
            {
              value: 'disabled',
              label: '$disabled',
            },
            {
              value: 'readOnly',
              label: '$readonly',
            },
            {
              value: 'readPretty',
              label: '$readPretty',
            },
          ],
        },
        "x-field": {
          name: "value",
          params: {
            withBind: true,
          }
        },
      },
    },
    {
      label: "$hidden",
      name: "hidden",
      valueInputSchema: {
        componentName: "div",
        props: {
          style: {
            flex: 1,
          }
        },
        children: [
          {
            componentName: "Switch",
            "x-field": {
              name: "value",
              params: {
                valuePropName: "checked",
                withBind: true,
              }
            },
          }
        ]
      },
    },
    {
      label: "$disabled",
      name: "disabled",
      valueInputSchema: {
        componentName: "div",
        props: {
          style: {
            flex: 1,
          }
        },
        children: [
          {
            componentName: "Switch",
            "x-field": {
              name: "value",
              params: {
                valuePropName: "checked",
                withBind: true,
              }
            },
          }
        ]
      },
    },
    {
      label: "$readonly",
      name: "readonly",
      valueInputSchema: {
        componentName: "div",
        props: {
          style: {
            flex: 1,
          }
        },
        children: [
          {
            componentName: "Switch",
            "x-field": {
              name: "value",
              params: {
                valuePropName: "checked",
                withBind: true,
              }
            },
          }
        ]
      },
    },
  ]
  const reactionCollapse = [{
    componentName: "CollapsePanel",
    "x-field": {
      type: "object",
      name: "x-field.reactionMeta",
      reactionMeta: {
        //$name的使用方式还有问题
        hidden: "{{!$form.getField('x-field.name')}}"
      }
    },
    props: {
      title: "$fieldReaction"
    },
    children: transformExpresionField(reactionFields)
  }]

  const bindFields = [
    {
      componentName: "Switch",
      "x-field": {
        name: "withBind",
        label: "$withBind",
        params: {
          valuePropName: "checked",
        }
      },
    },
    {
      componentName: "Input",
      "x-field": {
        name: "valuePropName",
        label: "$valuePropName",
      },
    },
  ]
  const bindCollapse = fieldOptions?.canBindField
    ? [
      {
        componentName: "CollapsePanel",
        "x-field": {
          type: "object",
          name: "x-field.params",
        },
        props: {
          title: "$fieldBind"
        },
        children: attachFormItem(bindFields)
      },
    ]
    : []
  const fieldDefineFields = [
    {
      componentName: "Select",
      "x-field": {
        name: "x-field.type",
        label: "$fieldType",
      },
      props: {
        options: [
          {
            value: '',
            label: '',
          },
          {
            value: 'normal',
            label: 'Normal',
          },
          {
            value: 'object',
            label: 'Object',
          },
          {
            value: 'array',
            label: 'Array',
          },
        ]
      },
    },
    {
      componentName: "Input",
      "x-field": {
        name: "x-field.name",
        label: "$fieldName",
      },
    },
    {
      componentName: "Input",
      "x-field": {
        name: "x-field.defaultValue",
        label: "$defaultValue",
      },
    },
    {
      componentName: "Input",
      "x-field": {
        name: "x-field.validateRules",
        label: "$validateRules",
      },
    }
  ]
  return [
    {
      componentName: "CollapsePanel",
      props: {
        title: "$fieldDefine",
      },
      children: attachFormItem(fieldDefineFields)
    },
    ...bindCollapse,
    ...reactionCollapse,
  ]
}