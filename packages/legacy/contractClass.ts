import { Address, Contract, ContractSpec} from '@stellar/stellar-sdk';
import { Benificary } from './src';

export class legacyContract extends Contract {
  spec: ContractSpec;

  constructor(address: string) {
    super(address);
    this.spec = new ContractSpec(["AAAAAQAAAAAAAAAAAAAACkJlbmlmaWNhcnkAAAAAAAMAAAAAAAAACmJlbmlmaWNhcnkAAAAAABMAAAAAAAAABXRva2VuAAAAAAAAEwAAAAAAAAAFdmFsdWUAAAAAAAAL",
    "AAAAAQAAAAAAAAAAAAAABWFkbWluAAAAAAAAAQAAAAAAAAAGYWRtaW5zAAAAAAPqAAAD7gAAACA=",
    "AAAAAQAAAAAAAAAAAAAABVBhcmFtAAAAAAAAAwAAAAAAAAAKYmVuaWZpY2FyeQAAAAAAEwAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAAAAAAV2YWx1ZQAAAAAAAAs=",
    "AAAAAAAAAAAAAAAJYWRkX2FkbWluAAAAAAAAAQAAAAAAAAAMYWRtaW5fYWRyZXNzAAAD7gAAACAAAAAA",
    "AAAAAAAAAAAAAAASYWRkX211bHRpcGxlX2Fzc2V0AAAAAAACAAAAAAAAAARkYXRhAAAD6gAAB9AAAAAKQmVuaWZpY2FyeQAAAAAAAAAAAARmcm9tAAAAEwAAAAA=",
    "AAAAAAAAAAAAAAALY2xhaW1fYXNzZXQAAAAABQAAAAAAAAAEZnJvbQAAABMAAAAAAAAAB2NsYWltZXIAAAAAEwAAAAAAAAAHbWVzc2FnZQAAAAAOAAAAAAAAAAdhZGRyZXNzAAAAA+4AAAAgAAAAAAAAAAlzaWduYXR1cmUAAAAAAAPuAAAAQAAAAAA=",
    "AAAAAAAAAAAAAAAPdGVzdF9hZG1pbl9zaWduAAAAAAAAAAABAAAAAQ==",
    "AAAAAAAAAAAAAAAKcGFyYW1fdGVzdAAAAAAAAQAAAAAAAAAEZnJvbQAAABMAAAABAAAAAQ==" ]);
  }
  public param_test(from:Address) {
    const invokeArgs = this.spec.funcArgsToScVals('param_test', {
      from:from
    });
    const operation = this.call('param_test', ...invokeArgs);
    return operation;
  }
  public add_multiple(data:Array<Benificary>,from:Address){
    const invokeArgs = this.spec.funcArgsToScVals('add_multiple_asset',{
        data:data,
        from:from
    })
    const operation = this.call('add_multiple_asset',...invokeArgs);
    return operation;

  }
}