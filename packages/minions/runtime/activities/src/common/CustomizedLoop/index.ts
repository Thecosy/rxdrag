import { AbstractActivity, Activity, Input, LogicFlow } from "@rxdrag/minions-runtime";
import { IActivityDefine } from "@rxdrag/minions-schema";
import _ from "lodash"

export interface IcustomizedLoopConifg {
  fromInput?: boolean,
  times?: number
}

@Activity(CustomizedLoop.NAME)
export class CustomizedLoop extends AbstractActivity<IcustomizedLoopConifg> {
  public static NAME = "system.customizedLoop"
  public static PORT_OUTPUT = "output"
  public static PORT_FINISHED = "finished"
  
  finished = false

  logicFlow?: LogicFlow;

  constructor(meta: IActivityDefine<IcustomizedLoopConifg>) {
    super(meta)
    if (meta.children) {
      //通过portId关联子流程的开始跟结束节点，端口号对应节点号
      this.logicFlow = new LogicFlow({ ...meta.children, id: meta.id }, undefined)

      //把子编排的出口，挂接到本地处理函数
      const outputPortMeta = this.meta.outPorts?.find(port=>port.name === CustomizedLoop.PORT_OUTPUT)
      if(outputPortMeta?.id){
        this.logicFlow?.jointers?.getOutput(outputPortMeta?.id)?.connect(this.oneOutputHandler)
      }else{
        console.error("No output port in CustomizedLoop")
      }

      const finishedPortMeta = this.meta.outPorts?.find(port=>port.name === CustomizedLoop.PORT_FINISHED)
      if(finishedPortMeta?.id){
        this.logicFlow?.jointers?.getOutput(finishedPortMeta?.id)?.connect(this.finisedHandler)
      }else{
        console.error("No finished port in CustomizedLoop")
      }
      
    } else {
      throw new Error("No implement on CustomizedLoop meta")
    }
  }

  @Input()
  inputHandler = (inputValue?: unknown) => {
    if (this.meta.config?.fromInput) {
      if (!_.isArray(inputValue)) {
        console.error("Loop input is not array")
      } else {
        for (const one of inputValue) {
          this.getInput()?.push(one)
          if(this.finished){
            break
          }
        }
      }
    } else if (_.isNumber(this.meta.config?.times)) {
      for (let i = 0; i < (this.meta.config?.times || 0); i++) {
        this.getInput()?.push(i)
        if(this.finished){
          break
        }
      }
    }
    if(!this.finished){
      this.next(inputValue, CustomizedLoop.PORT_FINISHED)
    }
  }

  getInput(){
    return this.logicFlow?.jointers?.getInput("input")
  }

  oneOutputHandler = (value: unknown)=>{
    //输出到响应端口
    this.output(value)
  }

  finisedHandler = (value: unknown)=>{
    this.finished = true
    //输出到响应端口
    this.next(value, CustomizedLoop.PORT_FINISHED)
  }

  output = (value: unknown) => {
    this.next(value, CustomizedLoop.PORT_OUTPUT)
  }
}